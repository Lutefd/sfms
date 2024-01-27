CREATE TABLE `s3-sfms_files_to_libraries` (
	`libraryId` varchar(255) NOT NULL,
	`fileId` varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `s3-sfms_library` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`ownerId` varchar(255) NOT NULL,
	`createdAt` timestamp(3) NOT NULL,
	`updatedAt` timestamp(3) NOT NULL,
	CONSTRAINT `s3-sfms_library_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `s3-sfms_files_to_libraries` ADD CONSTRAINT `s3-sfms_files_to_libraries_libraryId_s3-sfms_library_id_fk` FOREIGN KEY (`libraryId`) REFERENCES `s3-sfms_library`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `s3-sfms_files_to_libraries` ADD CONSTRAINT `s3-sfms_files_to_libraries_fileId_s3-sfms_file_id_fk` FOREIGN KEY (`fileId`) REFERENCES `s3-sfms_file`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `s3-sfms_library` ADD CONSTRAINT `s3-sfms_library_ownerId_s3-sfms_user_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `s3-sfms_user`(`id`) ON DELETE cascade ON UPDATE no action;