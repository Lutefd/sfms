// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
	timestamp,
	mysqlTableCreator,
	text,
	primaryKey,
	int,
	mysqlEnum,
	varchar,
	datetime,
} from 'drizzle-orm/mysql-core';
import cuid2 from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `s3-sfms_${name}`);
export type SelectSession = typeof sessionTable._.inferSelect;
export type DatabaseUser = typeof users._.inferSelect;

export const RoleEnum = mysqlEnum('role_enum', ['ADMIN', 'USER']);
export const UserStatusEnum = mysqlEnum('user_status_enum', [
	'ACTIVE',
	'BLOCKED',
]);
export const TwoFactorMethodEnum = mysqlEnum('two_factor_method_enum', [
	'NONE',
	'EMAIL',
	'AUTHENTICATOR',
]);
export const users = mysqlTable('user', {
	id: varchar('id', { length: 255 }).notNull().primaryKey(),
	name: varchar('name', { length: 255 }),
	email: varchar('email', { length: 255 }).notNull(),
	emailVerified: timestamp('emailVerified', { mode: 'date', fsp: 3 }),
	password: varchar('password', { length: 255 }),
	image: text('image'),
	role: RoleEnum.$default(() => 'USER'),
	status: UserStatusEnum.$default(() => 'ACTIVE'),
	two_factor_method: TwoFactorMethodEnum.$default(() => 'NONE'),
	two_factor_secret: text('two_factor_secret'),
});

export const oauthAccounts = mysqlTable('oauth_account', {
	provider_id: varchar('provider_id', { length: 255 }).notNull().primaryKey(),
	provider_user_id: varchar('provider_user_id', { length: 255 })
		.notNull()
		.unique(),
	user_id: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => users.id),
});

export const userRelations = relations(users, ({ many }) => ({
	files: many(files),
}));

export const files = mysqlTable('file', {
	id: varchar('id', { length: 255 }).notNull().primaryKey(),
	title: varchar('name', { length: 255 }).notNull(),
	type: varchar('type', { length: 255 }).notNull(),
	url: text('url').notNull(),
	ownerId: varchar('ownerId', { length: 255 })
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('createdAt', { mode: 'date', fsp: 3 }).notNull(),
	updatedAt: timestamp('updatedAt', { mode: 'date', fsp: 3 }).notNull(),
});

export const fileRelations = relations(files, ({ one }) => ({
	owner: one(users, {
		fields: [files.ownerId],
		references: [users.id],
	}),
}));

export const sessionTable = mysqlTable('session', {
	id: varchar('id', {
		length: 255,
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 255,
	})
		.notNull()
		.references(() => users.id),

	expiresAt: datetime('expires_at').notNull(),
});

export const verificationToken = mysqlTable('verification_token', {
	id: text('id').notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	token: varchar('token', { length: 255 }).notNull().unique(),
	expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const passwordResetToken = mysqlTable('password_reset_token', {
	id: text('id').notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	token: varchar('token', { length: 255 }).notNull().unique(),
	expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const emailTwoFactorVerificationToken = mysqlTable(
	'email_two_factor_verificationToken',
	{
		id: text('id').notNull(),
		email: varchar('email', { length: 255 }).notNull().unique(),
		token: varchar('token', { length: 255 }).notNull().unique(),
		expires: timestamp('expires', { mode: 'date' }).notNull(),
	}
);

export const emailTwoFactorConfirmation = mysqlTable(
	'email_two_factor_confirmation',
	{
		id: text('id').notNull(),
		userId: varchar('userId', { length: 255 })
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
