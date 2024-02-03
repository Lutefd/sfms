// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import cuid2 from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import {
	integer,
	primaryKey,
	sqliteTableCreator,
	text,
} from 'drizzle-orm/sqlite-core';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const sqliteTable = sqliteTableCreator((name) => `s3-sfms_${name}`);
export type SelectSession = typeof sessionTable._.inferSelect;
export type DatabaseUser = typeof users._.inferSelect;
export type Libraries = typeof libraries._.inferSelect;
export type Files = typeof files._.inferSelect;

export const users = sqliteTable('user', {
	id: text('id', { length: 255 }).notNull().primaryKey(),
	name: text('name', { length: 255 }),
	email: text('email', { length: 255 }).notNull(),
	emailVerified: integer('emailVerified', { mode: 'timestamp' }),
	password: text('password', { length: 255 }),
	image: text('image'),
	role: text('role', { enum: ['ADMIN', 'USER'] }).$default(() => 'USER'),
	status: text('status', { enum: ['ACTIVE', 'BLOCKED'] }).$default(
		() => 'ACTIVE'
	),
	two_factor_method: text('two_factor_method', {
		enum: ['NONE', 'EMAIL', 'AUTHENTICATOR'],
	}).$default(() => 'NONE'),
	two_factor_secret: text('two_factor_secret'),
	quota: integer('quota').notNull().default(1000),
	current_quota_use: integer('current_quota_use').notNull().default(0),
});

export const oauthAccounts = sqliteTable('oauth_account', {
	provider_id: text('provider_id', { length: 255 }).notNull().primaryKey(),
	provider_user_id: text('provider_user_id', { length: 255 })
		.notNull()
		.unique(),
	user_id: text('user_id', { length: 255 })
		.notNull()
		.references(() => users.id),
});

export const userRelations = relations(users, ({ many }) => ({
	files: many(files),
	libraries: many(libraries),
}));

export const files = sqliteTable('file', {
	id: text('id', { length: 255 }).notNull().primaryKey(),
	title: text('name', { length: 255 }).notNull(),
	type: text('type', { length: 255 }).notNull(),
	url: text('url').notNull(),
	ownerId: text('ownerId', { length: 255 })
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	size: integer('size').notNull(),
	createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

export const fileRelations = relations(files, ({ one, many }) => ({
	owner: one(users, {
		fields: [files.ownerId],
		references: [users.id],
	}),
	library: many(filesTolibraries),
}));

export const libraries = sqliteTable('library', {
	id: text('id', { length: 255 }).notNull().primaryKey(),
	name: text('name', { length: 255 }).notNull(),
	ownerId: text('ownerId', { length: 255 })
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

export const libraryRelations = relations(libraries, ({ one, many }) => ({
	owner: one(users, {
		fields: [libraries.ownerId],
		references: [users.id],
	}),
	files: many(filesTolibraries),
}));

export const filesTolibraries = sqliteTable(
	'files_to_libraries',
	{
		libraryId: text('libraryId', { length: 255 })
			.notNull()
			.references(() => libraries.id, { onDelete: 'cascade' }),
		fileId: text('fileId', { length: 255 })
			.notNull()
			.references(() => files.id, { onDelete: 'cascade' }),
	},
	(t) => ({
		pk: primaryKey(t.libraryId, t.fileId),
	})
);

export const filesTolibrariesRelations = relations(
	filesTolibraries,
	({ one }) => ({
		library: one(libraries, {
			fields: [filesTolibraries.libraryId],
			references: [libraries.id],
		}),
		file: one(files, {
			fields: [filesTolibraries.fileId],
			references: [files.id],
		}),
	})
);

export const sessionTable = sqliteTable('session', {
	id: text('id', {
		length: 255,
	}).primaryKey(),
	userId: text('user_id', {
		length: 255,
	})
		.notNull()
		.references(() => users.id),

	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

export const verificationToken = sqliteTable('verification_token', {
	id: text('id').notNull(),
	email: text('email', { length: 255 }).notNull().unique(),
	token: text('token', { length: 255 }).notNull().unique(),
	expires: integer('expires', { mode: 'timestamp' }).notNull(),
});

export const passwordResetToken = sqliteTable('password_reset_token', {
	id: text('id').notNull(),
	email: text('email', { length: 255 }).notNull().unique(),
	token: text('token', { length: 255 }).notNull().unique(),
	expires: integer('expires', { mode: 'timestamp' }).notNull(),
});

export const emailTwoFactorVerificationToken = sqliteTable(
	'email_two_factor_verificationToken',
	{
		id: text('id').notNull(),
		email: text('email', { length: 255 }).notNull().unique(),
		token: text('token', { length: 255 }).notNull().unique(),
		expires: integer('expires', { mode: 'timestamp' }).notNull(),
	}
);

export const emailTwoFactorConfirmation = sqliteTable(
	'email_two_factor_confirmation',
	{
		id: text('id').notNull(),
		userId: text('userId', { length: 255 })
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
			})
			.unique(),
	}
);

// export const sessions = pgTable('session', {
// 	sessionToken: text('sessionToken').notNull().primaryKey(),
// 	userId: text('userId')
// 		.notNull()
// 		.references(() => users.id, { onDelete: 'cascade' }),
// 	expires: timestamp('expires', { mode: 'date' }).notNull(),
// });

// export const verificationTokens = pgTable(
// 	'verificationToken',
// 	{
// 		identifier: text('identifier').notNull(),
// 		token: text('token').notNull(),
// 		expires: timestamp('expires', { mode: 'date' }).notNull(),
// 	},
// 	(vt) => ({
// 		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
// 	})
// );
