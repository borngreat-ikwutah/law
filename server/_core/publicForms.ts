import type { Express, Request, Response } from "express";
import { z } from "zod";
import { getDb } from "../db";
import { consultations, contactMessages } from "../../drizzle/schema";
import { notifyAdmin, sendConfiguredEmail } from "./email";
import { notifyOwner } from "./notification";

const submissions = new Map<string, number[]>();
function pruneSubmissions(now: number) {
  if (submissions.size < 1_000) return;
  for (const [key, times] of submissions) {
    const active = times.filter(time => now - time < 15 * 60_000);
    if (active.length) submissions.set(key, active);
    else submissions.delete(key);
    if (submissions.size >= 5_000) {
      while (submissions.size > 4_000) {
        const oldest = submissions.keys().next().value;
        if (!oldest) break;
        submissions.delete(oldest);
      }
      break;
    }
  }
}
function rateLimited(req: Request, res: Response) {
  const ip = (req.ip || req.socket.remoteAddress || "unknown").slice(0, 80);
  const now = Date.now();
  pruneSubmissions(now);
  const recent = (submissions.get(ip) || []).filter(
    time => now - time < 15 * 60_000
  );
  if (recent.length >= 5) {
    res.status(429).json({
      error: "Too many submissions. Please wait and try again later.",
    });
    return true;
  }
  recent.push(now);
  submissions.set(ip, recent);
  return false;
}

const email = z.string().trim().email().max(320);
const name = z.string().trim().min(2).max(180);
const phone = z
  .string()
  .trim()
  .min(5)
  .max(48)
  .regex(/^(?=.*\d)[+()\d\s.-]+$/, "Enter a valid phone number.");
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(value => {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return (
      Number.isFinite(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === value
    );
  }, "Enter a valid calendar date.");
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const bookingSchema = z
  .object({
    fullName: name,
    email,
    phone,
    preferredDate: date,
    preferredTime: time,
    practiceArea: z.string().trim().min(2).max(180),
    consultationType: z.enum([
      "In-Person Consultation",
      "Virtual Consultation",
      "Telephone Consultation",
    ]),
    legalNeeds: z.string().trim().min(10).max(1200),
    contactMethod: z.enum(["Email", "Phone"]),
    privacyConsent: z.string().optional(),
    smsConsent: z.literal("yes").optional(),
    mailingAddress: z.string().trim().max(500).optional().default(""),
    website: z.string().optional(),
  })
  .superRefine((value, context) => {
    if (value.smsConsent !== "yes") return;
    const mobileDigits = value.phone.replace(/\D/g, "");
    if (mobileDigits.length < 7 || mobileDigits.length > 15)
      context.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Enter a mobile number with 7 to 15 digits for SMS updates.",
      });
    if (!value.mailingAddress.trim())
      context.addIssue({
        code: "custom",
        path: ["mailingAddress"],
        message: "A mailing address is required when opting in to SMS updates.",
      });
  });
const contactSchema = z
  .object({
    fullName: name,
    email,
    phone: z
      .string()
      .trim()
      .max(48)
      .regex(/^$|^(?=.*\d)[+()\d\s.-]+$/)
      .optional()
      .default(""),
    subject: z.string().trim().min(2).max(200),
    message: z.string().trim().min(10).max(3000),
    privacyConsent: z.string().optional(),
    smsConsent: z.literal("yes").optional(),
    mailingAddress: z.string().trim().max(500).optional().default(""),
    website: z.string().optional(),
  })
  .superRefine((value, context) => {
    if (value.smsConsent !== "yes") return;
    if (!value.phone.trim())
      context.addIssue({
        code: "custom",
        path: ["phone"],
        message:
          "A mobile phone number is required when opting in to SMS updates.",
      });
    else {
      const mobileDigits = value.phone.replace(/\D/g, "");
      if (mobileDigits.length < 7 || mobileDigits.length > 15)
        context.addIssue({
          code: "custom",
          path: ["phone"],
          message: "Enter a mobile number with 7 to 15 digits for SMS updates.",
        });
    }
    if (!value.mailingAddress.trim())
      context.addIssue({
        code: "custom",
        path: ["mailingAddress"],
        message: "A mailing address is required when opting in to SMS updates.",
      });
  });
const notifyOwnerSafely = async (title: string, content: string) => {
  try {
    await notifyOwner({ title, content });
  } catch (error) {
    console.warn(
      "[Public form] Owner notification unavailable",
      error instanceof Error ? error.message : "unknown"
    );
  }
};
const notifyAdminSafely = async (title: string, content: string) => {
  try {
    await notifyAdmin(title, content);
  } catch (error) {
    console.warn(
      "[Public form] Admin email unavailable",
      error instanceof Error ? error.message : "unknown"
    );
  }
};
const sendCustomerEmailSafely = async (
  to: string,
  subject: string,
  text: string
) => {
  try {
    return (await sendConfiguredEmail({ to, subject, text })).sent;
  } catch (error) {
    console.warn(
      "[Public form] Customer confirmation unavailable",
      error instanceof Error ? error.message : "unknown"
    );
    return false;
  }
};
function bad(res: Response, error: unknown) {
  const message =
    error instanceof z.ZodError
      ? error.issues
          .map(issue => `${issue.path.join(" ") || "Form"}: ${issue.message}`)
          .join("; ")
      : "Please check the information and try again.";
  res.status(400).json({ error: message });
}

export function registerPublicFormRoutes(app: Express) {
  app.post("/api/public/consultations", async (req: Request, res: Response) => {
    if (rateLimited(req, res)) return;
    const parsed = bookingSchema.safeParse(req.body);
    if (!parsed.success) {
      bad(res, parsed.error);
      return;
    }
    const value = parsed.data;
    if (value.website) {
      res.status(200).json({ ok: true });
      return;
    }
    if (value.privacyConsent !== "yes") {
      res.status(400).json({ error: "Privacy consent is required." });
      return;
    }
    if (new Date(`${value.preferredDate}T23:59:59`).getTime() < Date.now()) {
      res.status(400).json({
        error: "Please choose a current or future consultation date.",
      });
      return;
    }
    try {
      const db = await getDb();
      if (!db) {
        res.status(503).json({
          error:
            "The request service is temporarily unavailable. Please try again later.",
        });
        return;
      }
      await db.insert(consultations).values({
        fullName: value.fullName,
        email: value.email.toLowerCase(),
        phone: value.phone,
        preferredDate: value.preferredDate,
        preferredTime: value.preferredTime,
        practiceArea: value.practiceArea,
        consultationType: value.consultationType,
        legalNeeds: value.legalNeeds,
        contactMethod: value.contactMethod,
        privacyConsent: true,
        mailingAddress:
          value.smsConsent === "yes" ? value.mailingAddress : null,
        smsConsent: value.smsConsent === "yes",
        smsConsentAt: value.smsConsent === "yes" ? new Date() : null,
        smsOptOutAt: null,
      });
      const emailSent = await sendCustomerEmailSafely(
        value.email,
        "We received your consultation request",
        `Hello ${value.fullName},\n\nThank you for contacting LEGAL AID LEGAL SERVICES LLC. Your consultation request has been received and is pending review. It is not a confirmed appointment until the firm approves it. We will follow up using your preferred contact method.\n\nPlease do not send confidential documents or highly sensitive information until appropriate professional arrangements are confirmed.\n\nLEGAL AID LEGAL SERVICES LLC`
      );
      const alert =
        "A new consultation request is awaiting review in the secure LEGAL AID LEGAL SERVICES LLC administrator dashboard. No matter details are included in this notification.";
      await notifyAdminSafely("New consultation request", alert);
      await notifyOwnerSafely("New consultation request", alert);
      res.status(201).json({
        ok: true,
        emailSent,
        smsConsentRecorded: value.smsConsent === "yes",
      });
    } catch (error) {
      console.error(
        "[Consultation] Save failed",
        error instanceof Error ? error.message : "unknown"
      );
      res.status(503).json({
        error:
          "We could not save your request at this time. Please try again later.",
      });
    }
  });

  app.post("/api/public/contact", async (req: Request, res: Response) => {
    if (rateLimited(req, res)) return;
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      bad(res, parsed.error);
      return;
    }
    const value = parsed.data;
    if (value.website) {
      res.status(200).json({ ok: true });
      return;
    }
    if (value.privacyConsent !== "yes") {
      res.status(400).json({ error: "Privacy consent is required." });
      return;
    }
    try {
      const db = await getDb();
      if (!db) {
        res.status(503).json({
          error:
            "The message service is temporarily unavailable. Please try again later.",
        });
        return;
      }
      await db.insert(contactMessages).values({
        fullName: value.fullName,
        email: value.email.toLowerCase(),
        phone: value.phone,
        subject: value.subject,
        message: value.message,
        privacyConsent: true,
        mailingAddress:
          value.smsConsent === "yes" ? value.mailingAddress : null,
        smsConsent: value.smsConsent === "yes",
        smsConsentAt: value.smsConsent === "yes" ? new Date() : null,
        smsOptOutAt: null,
      });
      const emailSent = await sendCustomerEmailSafely(
        value.email,
        "We received your message",
        `Hello ${value.fullName},\n\nThank you for contacting LEGAL AID LEGAL SERVICES LLC. Your general inquiry has been received. A member of the firm will review it and respond if appropriate. Submitting an inquiry does not automatically establish an attorney-client relationship.\n\nPlease do not send confidential documents or highly sensitive information through this channel.\n\nLEGAL AID LEGAL SERVICES LLC`
      );
      const alert =
        "A new general contact message is awaiting review in the secure LEGAL AID LEGAL SERVICES LLC administrator dashboard. No message body is included in this notification.";
      await notifyAdminSafely("New contact message", alert);
      await notifyOwnerSafely("New contact message", alert);
      res.status(201).json({
        ok: true,
        emailSent,
        smsConsentRecorded: value.smsConsent === "yes",
      });
    } catch (error) {
      console.error(
        "[Contact] Save failed",
        error instanceof Error ? error.message : "unknown"
      );
      res.status(503).json({
        error:
          "We could not save your message at this time. Please try again later.",
      });
    }
  });
}
