CREATE TABLE `s3-sfms_email_two_factor_confirmation` (
	`id` text NOT NULL,
	`userId` varchar(255) NOT NULL,
	CONSTRAINT `s3-sfms_email_two_factor_confirmation_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `s3-sfms_email_two_factor_verificationToken` (
	`id` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `s3-sfms_email_two_factor_verificationToken_email_unique` UNIQUE(`email`),
	CONSTRAINT `s3-sfms_email_two_factor_verificationToken_token_unique` UNIQUE(`token`)
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
CREATE TABLE `s3-sfms_oauth_account` (
	`provider_id` varchar(255) NOT NULL,
	`provider_user_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `s3-sfms_oauth_account_provider_id` PRIMARY KEY(`provider_id`),
	CONSTRAINT `s3-sfms_oauth_account_provider_user_id_unique` UNIQUE(`provider_user_id`)
);
--> statement-breakpoint
CREATE TABLE `s3-sfms_password_reset_token` (
	`id` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `s3-sfms_password_reset_token_email_unique` UNIQUE(`email`),
	CONSTRAINT `s3-sfms_password_reset_token_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `s3-sfms_session` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `s3-sfms_session_id` PRIMARY KEY(`id`)
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
CREATE TABLE `s3-sfms_verification_token` (
	`id` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `s3-sfms_verification_token_email_unique` UNIQUE(`email`),
	CONSTRAINT `s3-sfms_verification_token_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `s3-sfms_email_two_factor_confirmation` ADD CONSTRAINT `s3-sfms_email_two_factor_confirmation_userId_s3-sfms_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `s3-sfms_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `s3-sfms_file` ADD CONSTRAINT `s3-sfms_file_ownerId_s3-sfms_user_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `s3-sfms_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `s3-sfms_oauth_account` ADD CONSTRAINT `s3-sfms_oauth_account_user_id_s3-sfms_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `s3-sfms_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `s3-sfms_session` ADD CONSTRAINT `s3-sfms_session_user_id_s3-sfms_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `s3-sfms_user`(`id`) ON DELETE no action ON UPDATE no action;