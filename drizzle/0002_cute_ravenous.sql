ALTER TABLE `consultations` ADD `mailingAddress` varchar(500);--> statement-breakpoint
ALTER TABLE `consultations` ADD `smsConsent` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `consultations` ADD `smsConsentAt` timestamp;--> statement-breakpoint
ALTER TABLE `consultations` ADD `smsOptOutAt` timestamp;--> statement-breakpoint
ALTER TABLE `contact_messages` ADD `mailingAddress` varchar(500);--> statement-breakpoint
ALTER TABLE `contact_messages` ADD `smsConsent` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `contact_messages` ADD `smsConsentAt` timestamp;--> statement-breakpoint
ALTER TABLE `contact_messages` ADD `smsOptOutAt` timestamp;--> statement-breakpoint
INSERT INTO `site_settings` (`settingKey`, `settingValue`) VALUES
  ('firmName', 'LEGAL AID LEGAL SERVICES LLC'),
  ('phone', '(866) 356-7238 / (866) 838-0117 / (877) 217-9029'),
  ('email', 'legaldocuments19803@yahoo.com'),
  ('seoTitle', 'LEGAL AID LEGAL SERVICES LLC | Legal Services'),
  ('seoDescription', 'Contact LEGAL AID LEGAL SERVICES LLC for general inquiries and consultation requests. Office address, hours, and legal service details must be verified by the business.'),
  ('officeAddress', 'Office address not provided. Please call or email for location details.'),
  ('hours', 'Please call or email to confirm current hours.')
ON DUPLICATE KEY UPDATE
  `settingValue` = VALUES(`settingValue`),
  `updatedAt` = CURRENT_TIMESTAMP;--> statement-breakpoint
