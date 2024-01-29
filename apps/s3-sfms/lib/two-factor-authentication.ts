import { dbPromise } from '@/server/db';
import {
	emailTwoFactorConfirmation,
	emailTwoFactorVerificationToken,
} from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';

export const getEmailTwoFactorToken = async (token: string) => {
	const db = await dbPromise;
	try {
		const twoFactorToken =
			await db.query.emailTwoFactorVerificationToken.findFirst({
				where: eq(emailTwoFactorVerificationToken.token, token),
			});
		return twoFactorToken;
	} catch (error) {
		return null;
	}
};
export const getEmailTwoFactorTokenByEmail = async (email: string) => {
	const db = await dbPromise;
	try {
		const twoFactorToken =
			await db.query.emailTwoFactorVerificationToken.findFirst({
				where: eq(emailTwoFactorVerificationToken.email, email),
			});
		return twoFactorToken;
	} catch (error) {
		return null;
	}
};

export const getEmailTwoFactorConfirmation = async (userId: string) => {
	const db = await dbPromise;
	try {
		const twoFactorConfirmation =
			await db.query.emailTwoFactorConfirmation.findFirst({
				where: eq(emailTwoFactorConfirmation.userId, userId),
			});
		return twoFactorConfirmation;
	} catch (error) {
		return null;
	}
};

export const generateEmailTwoFactorConfirmation = async (userId: string) => {
	const db = await dbPromise;
	const id = generateId(15);
	await db.insert(emailTwoFactorConfirmation).values({
		id,
		userId,
	});
};

export const deleteEmailTwoFactorConfirmation = async (userId: string) => {
	const db = await dbPromise;
	try {
		await db
			.delete(emailTwoFactorConfirmation)
			.where(eq(emailTwoFactorConfirmation.userId, userId));
		return true;
	} catch (error) {
		return false;
	}
};
