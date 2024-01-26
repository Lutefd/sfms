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
} from 'drizzle-orm/mysql-core';
import type { AdapterAccount } from '@auth/core/adapters';
import cuid2 from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `s3-sfms_${name}`);

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
	id: varchar('id', { length: 255 })
		.$default(() => cuid2.createId())
		.notNull()
		.primaryKey(),
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

export const userRelations = relations(users, ({ many }) => ({
	files: many(files),
}));

export const files = mysqlTable('file', {
	id: varchar('id', { length: 255 })
		.$default(() => cuid2.createId())
		.notNull()
		.primaryKey(),
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

export const accounts = mysqlTable(
	'account',
	{
		userId: varchar('userId', { length: 255 })
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: varchar('type', { length: 255 })
			.$type<AdapterAccount['type']>()
			.notNull(),
		provider: varchar('provider', { length: 255 }).notNull(),
		providerAccountId: varchar('providerAccountId', {
			length: 255,
		}).notNull(),
		refresh_token: varchar('refresh_token', { length: 255 }),
		access_token: varchar('access_token', { length: 255 }),
		expires_at: int('expires_at'),
		token_type: varchar('token_type', { length: 255 }),
		scope: varchar('scope', { length: 255 }),
		id_token: varchar('id_token', { length: 2048 }),
		session_state: varchar('session_state', { length: 255 }),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	})
);

export const verificationToken = mysqlTable('verificationToken', {
	id: text('id')
		.$default(() => cuid2.createId())
		.notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	token: varchar('token', { length: 255 }).notNull().unique(),
	expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const passwordResetToken = mysqlTable('passwordResetToken', {
	id: text('id')
		.$default(() => cuid2.createId())
		.notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	token: varchar('token', { length: 255 }).notNull().unique(),
	expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const emailTwoFactorVerificationToken = mysqlTable(
	'emailTwoFactorVerificationToken',
	{
		id: text('id')
			.$default(() => cuid2.createId())
			.notNull(),
		email: varchar('email', { length: 255 }).notNull().unique(),
		token: varchar('token', { length: 255 }).notNull().unique(),
		expires: timestamp('expires', { mode: 'date' }).notNull(),
	}
);

export const emailTwoFactorConfirmation = mysqlTable(
	'emailTwoFactorConfirmation',
	{
		id: text('id')
			.$default(() => cuid2.createId())
			.notNull(),
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
