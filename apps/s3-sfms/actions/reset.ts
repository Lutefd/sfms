'use server';

import { getUserByEmail } from '@/lib/user';
import { ResetSchema, ResetPasswordSchema } from '@/schemas';
import { z } from 'zod';
import { sendPasswordResetEmail } from './email';
import { generatePasswordResetToken } from '@/lib/token';
import { getPasswordResetTokenbyToken } from '@/lib/password-reset';
import bcrypt from 'bcryptjs';
import { dbPromise } from '@/server/db';
import { passwordResetToken, users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
	const validatedFields = ResetSchema.safeParse(values);

	if (!validatedFields.success) {
		return {
			error: 'Email inválido',
		};
	}
	const { email } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser) {
		return {
			error: 'Email não encontrado',
		};
	}
	const passwordResetToken = await generatePasswordResetToken(email);
	await sendPasswordResetEmail(email, passwordResetToken);
	return {
		success: 'Email enviado com sucesso',
	};
};

export const resetPassword = async (
	values: z.infer<typeof ResetPasswordSchema>,
	token?: string | null
) => {
	const db = await dbPromise;
	if (!token) {
		return {
			error: 'Token inválido',
		};
	}
	const validatedFields = ResetPasswordSchema.safeParse(values);
	if (!validatedFields.success) {
		return {
			error: 'Senha inválida',
		};
	}
	const { password } = validatedFields.data;
	const existingToken = await getPasswordResetTokenbyToken(token);
	if (!existingToken) {
		return {
			error: 'Token inválido',
		};
	}
	const hasExpired = new Date(existingToken.expires) < new Date();

	if (hasExpired) {
		return {
			error: 'Token expirado',
		};
	}
	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser) {
		return {
			error: 'Usuário não encontrado',
		};
	}
	const hashedPassword = await bcrypt.hash(password, 10);

	await db
		.update(users)
		.set({
			password: hashedPassword,
		})
		.where(eq(users.id, existingUser.id));

	await db
		.delete(passwordResetToken)
		.where(eq(passwordResetToken.id, existingToken.id));

	return {
		success: 'Senha alterada com sucesso',
	};
};
