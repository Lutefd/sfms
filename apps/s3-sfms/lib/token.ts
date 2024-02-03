import { db } from '@/server/db';
import {
	passwordResetToken,
	emailTwoFactorVerificationToken,
	verificationToken,
} from '@/server/db/schema';
import cuid2 from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { getPasswordResetTokenbyEmail } from './password-reset';
import crypto from 'crypto';
import { getEmailTwoFactorTokenByEmail } from './two-factor-authentication';
import { generateId } from 'lucia';

export const generateVerificationToken = async (email: string) => {
	const token = cuid2.createId();
	const expires = new Date(new Date().getTime() + 3600 * 1000);
	const existingToken = await getVerificationTokenByEmail(email);
	if (existingToken) {
		await db
			.delete(verificationToken)
			.where(eq(verificationToken.id, existingToken.id));
	}
	const newTokenId = generateId(15);
	const newTokenData = {
		id: newTokenId,
		email,
		token,
		expires,
	};
	const newVerificationToken = await db
		.insert(verificationToken)
		.values(newTokenData)
		.returning({
			id: verificationToken.id,
			token: verificationToken.token,
		});
	return token;
};

export const getVerificationTokenByEmail = async (email: string) => {
	try {
		const result = await db.query.verificationToken.findFirst({
			where: eq(verificationToken.email, email),
		});
		return result;
	} catch (error) {
		return null;
	}
};
export const getVerificationTokenByToken = async (token: string) => {
	try {
		console.log('token in getVerificationTokenByToken', token);
		const result = await db.query.verificationToken.findFirst({
			where: eq(verificationToken.token, token),
		});
		return result;
	} catch (error) {
		return null;
	}
};

export const generatePasswordResetToken = async (email: string) => {
	const token = cuid2.createId();
	const expires = new Date(new Date().getTime() + 3600 * 1000);
	const existingToken = await getPasswordResetTokenbyEmail(email);
	if (existingToken) {
		await db
			.delete(passwordResetToken)
			.where(eq(passwordResetToken.id, existingToken.id));
	}

	const newTokenId = generateId(15);
	const newTokenData = {
		id: newTokenId,
		email,
		token,
		expires,
	};
	const newPasswordResetToken = await db
		.insert(passwordResetToken)
		.values(newTokenData);

	return token;
};

export const generateEmailTwoFactorToken = async (email: string) => {
	const token = crypto.randomInt(100000, 999999).toString();
	const expires = new Date(new Date().getTime() + 1800 * 1000);
	const existingToken = await getEmailTwoFactorTokenByEmail(email);
	if (existingToken) {
		await db
			.delete(emailTwoFactorVerificationToken)
			.where(eq(emailTwoFactorVerificationToken.id, existingToken.id));
	}

	const newTokenId = generateId(15);
	const newTokenData = {
		id: newTokenId,
		email,
		token,
		expires,
	};
	const newTwoFactorToken = await db
		.insert(emailTwoFactorVerificationToken)
		.values(newTokenData);

	return token;
};

export const deleteEmailTwoFactorToken = async (tokenId: string) => {
	await db
		.delete(emailTwoFactorVerificationToken)
		.where(eq(emailTwoFactorVerificationToken.id, tokenId));
};
