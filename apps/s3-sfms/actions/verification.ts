'use server';

import { getVerificationTokenByToken } from '@/lib/token';
import { getUserByEmail } from '@/lib/user';
import { dbPromise } from '@/server/db';
import { users, verificationToken } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function verificateToken(token: string) {
	const db = await dbPromise;
	const existingToken = await getVerificationTokenByToken(token);
	console.log('token in verification', token);
	console.log('existingToken in verification', existingToken);
	if (!existingToken)
		return {
			error: 'Token não encontrado',
		};
	const hasExpired = existingToken.expires < new Date();
	if (hasExpired)
		return {
			error: 'Token expirado',
		};

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser)
		return {
			error: 'Usuário não encontrado',
		};
	await db
		.update(users)
		.set({
			emailVerified: new Date(),
			email: existingToken.email,
		})
		.where(eq(users.id, existingUser.id));
	await db
		.delete(verificationToken)
		.where(eq(verificationToken.id, existingToken.id));

	return {
		success: 'Email verificado com sucesso!',
	};
}
