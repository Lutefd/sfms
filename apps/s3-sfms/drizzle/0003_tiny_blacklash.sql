ALTER TABLE `s3-sfms_file` MODIFY COLUMN `createdAt` timestamp(3) DEFAULT (now());--> statement-breakpoint
ALTER TABLE `s3-sfms_file` MODIFY COLUMN `updatedAt` timestamp(3) DEFAULT (now());--> statement-breakpoint
ALTER TABLE `s3-sfms_library` MODIFY COLUMN `createdAt` timestamp(3) DEFAULT (now());--> statement-breakpoint
ALTER TABLE `s3-sfms_library` MODIFY COLUMN `updatedAt` timestamp(3) DEFAULT (now());--> statement-breakpoint
ALTER TABLE `s3-sfms_file` ADD `size` int NOT NULL;--> statement-breakpoint
ALTER TABLE `s3-sfms_user` ADD `quota` int DEFAULT 1000 NOT NULL;--> statement-breakpoint
ALTER TABLE `s3-sfms_user` ADD `current_quota_use` int DEFAULT 0 NOT NULL;