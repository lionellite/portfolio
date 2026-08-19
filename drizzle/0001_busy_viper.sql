CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(191) NOT NULL,
	`title` varchar(240) NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`tags` text NOT NULL,
	`coverImageUrl` varchar(1024),
	`isPublished` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`message` text NOT NULL,
	`notificationSent` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `educations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`credential` varchar(260) NOT NULL,
	`institution` varchar(220) NOT NULL,
	`location` varchar(160),
	`startDate` varchar(80),
	`endDate` varchar(80),
	`description` text,
	`displayOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `educations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(220) NOT NULL,
	`organization` varchar(220) NOT NULL,
	`location` varchar(160),
	`startDate` varchar(80) NOT NULL,
	`endDate` varchar(80),
	`isCurrent` boolean NOT NULL DEFAULT false,
	`description` text NOT NULL,
	`displayOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `experiences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(160) NOT NULL,
	`headline` varchar(240) NOT NULL,
	`bio` text NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(40),
	`location` varchar(160),
	`linkedinUrl` varchar(512),
	`githubUrl` varchar(512),
	`photoUrl` varchar(1024),
	`photoKey` varchar(512),
	`availability` varchar(240),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolio_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(191) NOT NULL,
	`title` varchar(220) NOT NULL,
	`shortDescription` text NOT NULL,
	`description` text NOT NULL,
	`technologies` text NOT NULL,
	`projectUrl` varchar(1024),
	`githubUrl` varchar(1024),
	`coverImageUrl` varchar(1024),
	`coverImageKey` varchar(512),
	`isPublished` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `projects_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(120) NOT NULL,
	`name` varchar(160) NOT NULL,
	`proficiency` varchar(80),
	`displayOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `skills_id` PRIMARY KEY(`id`)
);
