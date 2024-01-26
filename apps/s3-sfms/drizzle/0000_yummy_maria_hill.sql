CREATE TABLE `s3-sfms_account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` varchar(255),
	`access_token` varchar(255),
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` varchar(2048),
	`session_state` varchar(255),
	CONSTRAINT `s3-sfms_account_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `s3-sfms_emailTwoFactorConfirmation` (
	`id` text NOT NULL,
	`userId` varchar(255) NOT NULL,
	CONSTRAINT `s3-sfms_emailTwoFactorConfirmation_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `s3-sfms_emailTwoFactorVerificationToken` (
	`id` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `s3-sfms_emailTwoFactorVerificationToken_email_unique` UNIQUE(`email`),
	CONSTRAINT `s3-sfms_emailTwoFactorVerificationToken_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `s3-sfms_file` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`url` text NOT NULL,
	`ownerId` varchar(255) NOT NULL,
	`createdAt` timestamp(3) NOT NULL,
	`updatedAt` timestamp(3) NOT NULL,
	CONSTRAINT `s3-sfms_file_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `s3-sfms_passwordResetToken` (
	`id` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `s3-sfms_passwordResetToken_email_unique` UNIQUE(`email`),
	CONSTRAINT `s3-sfms_passwordResetToken_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `s3-sfms_user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3),
	`password` varchar(255),
	`image` text,
	`role_enum` enum('ADMIN','USER'),
	`user_status_enum` enum('ACTIVE','BLOCKED'),
	`two_factor_method_enum` enum('NONE','EMAIL','AUTHENTICATOR'),
	`two_factor_secret` text,
	CONSTRAINT `s3-sfms_user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `s3-sfms_verificationToken` (
	`id` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `s3-sfms_verificationToken_email_unique` UNIQUE(`email`),
	CONSTRAINT `s3-sfms_verificationToken_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `s3-sfms_account` ADD CONSTRAINT `s3-sfms_account_userId_s3-sfms_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `s3-sfms_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `s3-sfms_emailTwoFactorConfirmation` ADD CONSTRAINT `s3-sfms_emailTwoFactorConfirmation_userId_s3-sfms_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `s3-sfms_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `s3-sfms_file` ADD CONSTRAINT `s3-sfms_file_ownerId_s3-sfms_user_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `s3-sfms_user`(`id`) ON DELETE cascade ON UPDATE no action;