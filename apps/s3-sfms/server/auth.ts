import { Lucia } from 'lucia';
import { DrizzleMySQLAdapter } from '@lucia-auth/adapter-drizzle';
import { authDb, dbPromise } from './db';
import { DatabaseUser, sessionTable, users } from './db/schema';
import { cache } from 'react';
import type { Session, User } from 'lucia';

import { cookies } from 'next/headers';
const adapter = new DrizzleMySQLAdapter(authDb, sessionTable, users); // your adapter

export const lucia = new Lucia(adapter, {
	getUserAttributes(databaseUserAttributes) {
		return {
			email: databaseUserAttributes.email,
			image: databaseUserAttributes.image,
			role: databaseUserAttributes.role,
			status: databaseUserAttributes.status,
			two_factor_method: databaseUserAttributes.two_factor_method,
			name: databaseUserAttributes.name,
		};
	},
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === 'production',
		},
	},
});
export const validateRequest = cache(
	async (): Promise<
		{ user: User; session: Session } | { user: null; session: null }
	> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
		if (!sessionId) {
			return {
				user: null,
				session: null,
			};
		}

		const result = await lucia.validateSession(sessionId);
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(
					result.session.id
				);
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				);
			}
		} catch {}
		return result;
	}
);

// IMPORTANT!
declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Omit<DatabaseUser, 'id'>;
	}
}
