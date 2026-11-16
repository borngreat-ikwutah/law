import { useEffect } from "react";
import { Link } from "wouter";
import { PageHero } from "@/components/site/SiteShell";
import {
  businessEmail,
  businessPhones,
  firmName,
  phoneHref,
} from "@/lib/brand";
import { disclaimer, setPageMeta } from "@/lib/site";

type PolicyType = "privacy" | "terms" | "disclaimer";

function BusinessContact() {
  return (
    <div className="policy-contact">
      <p>
        <strong>{firmName}</strong> — SMS customer-care help and opt-out
        requests:
      </p>
      <ul>
        {businessPhones.map(phone => (
          <li key={phone}>
            <a href={phoneHref(phone)}>{phone}</a>
          </li>
        ))}
        <li>
          <a href={`mailto:${businessEmail}`}>{businessEmail}</a>
        </li>
      </ul>
    </div>
  );
}

function SmsDeliveryNotice() {
  return (
    <p className="sms-delivery-notice" role="note">
      The website currently records SMS opt-in preferences, but automated SMS
      delivery is not active until the business connects and configures a
      messaging provider.
    </p>
  );
}

export function PolicyPage({ type }: { type: PolicyType }) {
  const title =
    type === "privacy"
      ? "Privacy Policy"
      : type === "terms"
        ? "Terms & Conditions"
        : "Legal Disclaimer";
  const description =
    type === "privacy"
      ? `How ${firmName} handles contact information and SMS customer-care preferences.`
      : type === "terms"
        ? `Website and SMS customer-care messaging terms for ${firmName}.`
        : `Important information about legal content and the absence of an attorney-client relationship.`;

  useEffect(() => setPageMeta(title, description, true), [title, description]);

  return (
    <>
      <PageHero
        eyebrow={
          type === "disclaimer"
            ? "Important information"
            : "Customer care & policies"
        }
        title={title}
        intro={
          type === "privacy"
            ? `${firmName} respects your privacy. This policy explains how information is handled when you contact us or opt in to SMS customer-care messages.`
            : type === "terms"
              ? `These terms explain use of this website and the customer-care SMS program offered by ${firmName}.`
              : `Browsing this website or submitting a general inquiry does not automatically establish an attorney-client relationship.`
        }
      />
      <section className="section">
        <div className="container policy-content">
          {type === "privacy" ? (
            <>
              <p>
                <strong>{firmName}</strong> respects your privacy. By opting
                into our SMS messaging service, you agree to the following terms
                regarding how we handle your data.
              </p>
              <h2>Information we collect</h2>
              <p>
                When you sign up for SMS updates, we collect your name, email
                address, mailing address, and mobile phone number. Information
                may be collected through the website contact form, email, rental
                agreement, or third-party reservation systems. On this website,
                mailing address is requested only if you choose the optional SMS
                opt-in.
              </p>
              <h2>How we use your information</h2>
              <p>
                We use SMS opt-in information solely for sending customer-care
                messages. Other contact or consultation details you submit are
                used to review and respond to that inquiry. Message frequency
                varies depending on your communication needs; messages are
                recurring and may be sent as needed for customer care.
              </p>
              <h2>Security and retention</h2>
              <p>
                We use secure storage measures designed to help protect your
                information from unauthorized access. We retain your SMS
                subscriber information while you are subscribed. You may request
                deletion at any time by contacting us using the details below.
                Message and data rates may apply; your mobile carrier may charge
                fees, especially if you do not have an unlimited texting or data
                plan.
              </p>
              <h2>Data sharing and mobile opt-in</h2>
              <p>
                We do not share customer data with third parties for promotional
                or marketing purposes. We will not sell, rent, or share
                collected mobile numbers. Mobile opt-in and consent are never
                shared with anyone for any purpose. Any information-sharing
                statement elsewhere in this policy excludes mobile opt-in data.
              </p>
              <h2>SMS help and opting out</h2>
              <p>
                You may opt out at any time by replying STOP or CANCEL to a
                message, or by texting, emailing, or calling us using the
                contact details below. For assistance, reply HELP or contact us.
                When SMS delivery is configured, the business will send an
                opt-out confirmation where supported; carrier delivery may vary.
                Until a messaging provider is connected, this website cannot
                send or confirm text messages. A HELP response, when the
                messaging service is active, will include our phone number,
                email, and website information.
              </p>
              <BusinessContact />
              <SmsDeliveryNotice />
              <h2>Website inquiries and legal matters</h2>
              <p>
                Do not send confidential documents or highly sensitive legal
                information through a general website form. Submitting an
                inquiry does not automatically establish an attorney-client
                relationship. Privacy rights and legal notices may depend on the
                jurisdiction and the firm's actual services.
              </p>
            </>
          ) : type === "terms" ? (
            <>
              <h2>General website use</h2>
              <p>
                Website materials are provided for general informational
                purposes. Do not rely on them as legal advice or as a substitute
                for advice tailored to your circumstances.
              </p>
              <h2>No attorney-client relationship</h2>
              <p>
                Browsing this website or submitting a general inquiry does not
                automatically create an attorney-client relationship. A
                professional relationship begins only when the firm confirms
                acceptance under its applicable procedures.
              </p>
              <h2>SMS messaging terms and conditions</h2>
              <p>
                By providing your mobile phone number and agreeing to receive
                texts, you consent to receive recurring SMS messages from{" "}
                <strong>{firmName}</strong> regarding customer care only.
                Message frequency varies depending on your communication needs.
                Message and data rates may apply. Your mobile carrier may charge
                fees, especially if you do not have an unlimited texting or data
                plan. Consent to receive SMS messages is not a condition of
                purchase.
              </p>
              <p>
                You may reply STOP or CANCEL to opt out of future messages, or
                contact us by phone or email. When SMS delivery is configured,
                the business will send an opt-out confirmation where supported;
                carrier delivery may vary. Until a messaging provider is
                connected, this website cannot send or confirm text messages.
                You may reply HELP for assistance. When the messaging service is
                active, a HELP response will provide our phone number, email,
                and website information.
              </p>
              <BusinessContact />
              <h2>Data sharing</h2>
              <p>
                SMS opt-in and consent information, including mobile numbers, is
                never sold, rented, or shared with third parties for any
                purpose. We do not share customer information for promotional or
                marketing purposes. Any general information-sharing statement
                excludes mobile opt-in data.
              </p>
              <SmsDeliveryNotice />
              <h2>Customer-care messages only</h2>
              <p>
                SMS consent is optional and is not required to submit a website
                inquiry or make a purchase. Messages are for customer care, not
                promotional marketing. You may request deletion of your
                subscription information at any time by contacting us.
              </p>
              <h2>Accuracy and availability</h2>
              <p>
                Practice-area descriptions, attorney profiles, articles, and
                credentials should be verified by the business before being
                relied on. Terms may be updated to accurately reflect the actual
                service and applicable legal requirements.
              </p>
            </>
          ) : (
            <>
              <h2>No legal advice or relationship</h2>
              <p>{disclaimer}</p>
              <h2>Verify content and jurisdiction</h2>
              <p>
                Legal rules vary by location and can change. The website's
                demonstration practice areas and educational articles are not a
                representation of verified services, legal credentials, or
                advice for a particular jurisdiction.
              </p>
              <h2>Urgent matters</h2>
              <p>
                Do not rely on this website for urgent legal deadlines,
                emergencies, or required filings. Contact a qualified
                professional or relevant public authority in the applicable
                jurisdiction.
              </p>
            </>
          )}
          <p className="policy-updated">
            Questions about these policies? Contact <strong>{firmName}</strong>{" "}
            at <a href={`mailto:${businessEmail}`}>{businessEmail}</a>.
          </p>
          <p>
            See also the <Link href="/privacy">Privacy Policy</Link> and{" "}
            <Link href="/terms">Terms &amp; Conditions</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
