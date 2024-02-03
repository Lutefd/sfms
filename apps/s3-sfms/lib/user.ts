import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const getUserByEmail = async (email: string) => {
	try {
		const user = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		return user;
	} catch (error) {
		return null;
	}
};

export const getUserById = async (id: string) => {
	try {
		const user = await db.query.users.findFirst({
			where: eq(users.id, id),
		});

		return user;
	} catch (error) {
		return null;
	}
};

export const setDefaultValues = async (id: string) => {
	try {
		const user = await db
			.update(users)
			.set({
				role: 'USER',
				status: 'ACTIVE',
				emailVerified: new Date(),
				two_factor_method: 'NONE',
			})
			.where(eq(users.id, id));

		return user;
	} catch (error) {
		return null;
	}
};

export const setUserRole = async (id: string, role: 'ADMIN' | 'USER') => {
	try {
		const user = await db
			.update(users)
			.set({
				role,
			})
			.where(eq(users.id, id));

		return user;
	} catch (error) {
		return null;
	}
};

export const setUserStatus = async (
	id: string,
	status: 'ACTIVE' | 'BLOCKED'
) => {
	try {
		const user = await db
			.update(users)
			.set({
				status,
			})
			.where(eq(users.id, id));

		return user;
	} catch (error) {
		return null;
	}
};
