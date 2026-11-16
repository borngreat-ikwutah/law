CREATE TABLE `admin_bootstrap` (
	`id` int NOT NULL,
	`claimed` boolean NOT NULL DEFAULT false,
	`claimedBy` int,
	`claimedAt` timestamp,
	CONSTRAINT `admin_bootstrap_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attorneys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`fullName` varchar(180) NOT NULL,
	`title` varchar(180) NOT NULL,
	`specialty` varchar(255) NOT NULL,
	`summary` text NOT NULL,
	`biography` text NOT NULL,
	`education` text NOT NULL,
	`credentials` text NOT NULL,
	`experience` text NOT NULL,
	`languages` text NOT NULL,
	`photoUrl` varchar(500),
	`isDemo` boolean NOT NULL DEFAULT true,
	`published` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `attorneys_id` PRIMARY KEY(`id`),
	CONSTRAINT `attorneys_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blog_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`slug` varchar(140) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `blog_categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`title` varchar(240) NOT NULL,
	`category` varchar(120) NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`author` varchar(180) NOT NULL,
	`imageUrl` varchar(500),
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`publishedAt` timestamp,
	`isDemo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `consultations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(180) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(48) NOT NULL,
	`preferredDate` varchar(10) NOT NULL,
	`preferredTime` varchar(16) NOT NULL,
	`practiceArea` varchar(180) NOT NULL,
	`consultationType` enum('In-Person Consultation','Virtual Consultation','Telephone Consultation') NOT NULL,
	`legalNeeds` text NOT NULL,
	`contactMethod` enum('Email','Phone') NOT NULL,
	`privacyConsent` boolean NOT NULL DEFAULT false,
	`status` enum('pending','approved','declined','completed','cancelled') NOT NULL DEFAULT 'pending',
	`internalNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(180) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(48) NOT NULL,
	`subject` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`privacyConsent` boolean NOT NULL DEFAULT false,
	`status` enum('new','read','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `practice_areas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`title` varchar(180) NOT NULL,
	`summary` text NOT NULL,
	`overview` text NOT NULL,
	`services` text NOT NULL,
	`challenges` text NOT NULL,
	`assistance` text NOT NULL,
	`faqs` text NOT NULL,
	`imageUrl` varchar(500),
	`isDemo` boolean NOT NULL DEFAULT true,
	`published` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `practice_areas_id` PRIMARY KEY(`id`),
	CONSTRAINT `practice_areas_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(120) NOT NULL,
	`settingValue` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_settingKey_unique` UNIQUE(`settingKey`)
);
