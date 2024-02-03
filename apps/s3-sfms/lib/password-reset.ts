import { db } from '@/server/db';
import { passwordResetToken } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const getPasswordResetTokenbyToken = async (token: string) => {
	try {
		const result = await db.query.passwordResetToken.findFirst({
			where: eq(passwordResetToken.token, token),
		});
		return result;
	} catch (error) {
		return null;
	}
};

export const getPasswordResetTokenbyEmail = async (email: string) => {
	try {
		const result = await db.query.passwordResetToken.findFirst({
			where: eq(passwordResetToken.email, email),
		});
		return result;
	} catch (error) {
		return null;
	}
};
