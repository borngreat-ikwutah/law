import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const consultations = mysqlTable("consultations", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 180 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 48 }).notNull(),
  preferredDate: varchar("preferredDate", { length: 10 }).notNull(),
  preferredTime: varchar("preferredTime", { length: 16 }).notNull(),
  practiceArea: varchar("practiceArea", { length: 180 }).notNull(),
  consultationType: mysqlEnum("consultationType", [
    "In-Person Consultation",
    "Virtual Consultation",
    "Telephone Consultation",
  ]).notNull(),
  legalNeeds: text("legalNeeds").notNull(),
  contactMethod: mysqlEnum("contactMethod", ["Email", "Phone"]).notNull(),
  privacyConsent: boolean("privacyConsent").notNull().default(false),
  mailingAddress: varchar("mailingAddress", { length: 500 }),
  smsConsent: boolean("smsConsent").notNull().default(false),
  smsConsentAt: timestamp("smsConsentAt"),
  smsOptOutAt: timestamp("smsOptOutAt"),
  status: mysqlEnum("status", [
    "pending",
    "approved",
    "declined",
    "completed",
    "cancelled",
  ])
    .notNull()
    .default("pending"),
  internalNotes: text("internalNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 180 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 48 }).notNull(),
  subject: varchar("subject", { length: 200 }).notNull(),
  message: text("message").notNull(),
  privacyConsent: boolean("privacyConsent").notNull().default(false),
  mailingAddress: varchar("mailingAddress", { length: 500 }),
  smsConsent: boolean("smsConsent").notNull().default(false),
  smsConsentAt: timestamp("smsConsentAt"),
  smsOptOutAt: timestamp("smsOptOutAt"),
  status: mysqlEnum("status", ["new", "read", "closed"])
    .notNull()
    .default("new"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const attorneys = mysqlTable("attorneys", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  fullName: varchar("fullName", { length: 180 }).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  specialty: varchar("specialty", { length: 255 }).notNull(),
  summary: text("summary").notNull(),
  biography: text("biography").notNull(),
  education: text("education").notNull(),
  credentials: text("credentials").notNull(),
  experience: text("experience").notNull(),
  languages: text("languages").notNull(),
  photoUrl: varchar("photoUrl", { length: 500 }),
  isDemo: boolean("isDemo").notNull().default(true),
  published: boolean("published").notNull().default(false),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const practiceAreas = mysqlTable("practice_areas", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  summary: text("summary").notNull(),
  overview: text("overview").notNull(),
  services: text("services").notNull(),
  challenges: text("challenges").notNull(),
  assistance: text("assistance").notNull(),
  faqs: text("faqs").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  isDemo: boolean("isDemo").notNull().default(true),
  published: boolean("published").notNull().default(false),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const blogCategories = mysqlTable("blog_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull().unique(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  title: varchar("title", { length: 240 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: varchar("author", { length: 180 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  status: mysqlEnum("status", ["draft", "published"])
    .notNull()
    .default("draft"),
  publishedAt: timestamp("publishedAt"),
  isDemo: boolean("isDemo").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 120 }).notNull().unique(),
  settingValue: text("settingValue").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const adminBootstrap = mysqlTable("admin_bootstrap", {
  id: int("id").primaryKey(),
  claimed: boolean("claimed").notNull().default(false),
  claimedBy: int("claimedBy"),
  claimedAt: timestamp("claimedAt"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Consultation = typeof consultations.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
