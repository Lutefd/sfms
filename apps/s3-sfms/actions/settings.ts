'use server';

import { z } from 'zod';

import { SettingsSchema } from '@/schemas';
import { getUserByEmail, getUserById } from '@/lib/user';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateVerificationToken } from '@/lib/token';
import { sendVerificationEmail } from './email';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { encodeHex } from 'oslo/encoding';
import { createTOTPKeyURI } from 'oslo/otp';
import { readSession } from './session';

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
	const user = await readSession();
	if (!user) return { error: 'Você não está logado' };
	const dbUser = await getUserById(user.id);
	if (!dbUser) return { error: 'Usuário não encontrado' };

	if (values.email && values.email != user.email) {
		const existingUser = await getUserByEmail(values.email);
		if (existingUser && existingUser.id != user.id) {
			return { error: 'Email já cadastrado' };
		}
		const verificationToken = await generateVerificationToken(values.email);
		await sendVerificationEmail(values.email, verificationToken);

		return { success: 'Confirmação de email enviada para o email' };
	}

	if (values.password && values.newPassword && dbUser.password) {
		const passwordMatch = await bcrypt.compare(
			values.password,
			dbUser.password
		);
		if (!passwordMatch) {
			return { error: 'Senha atual incorreta' };
		}
		const hashedPassword = await bcrypt.hash(values.newPassword, 10);
		values.password = hashedPassword;
		values.newPassword = undefined;
	}

	if (
		values.two_factor_method &&
		values.two_factor_method != dbUser.two_factor_method
	) {
		if (values.two_factor_method == 'AUTHENTICATOR') {
			const twoFactorSecret = crypto.getRandomValues(new Uint8Array(20));
			const twoFactorSecretEncoded = encodeHex(twoFactorSecret);
			await db
				.update(users)
				.set({ two_factor_secret: twoFactorSecretEncoded })
				.where(eq(users.id, user.id));
			const uri = createTOTPKeyURI(
				'authkit',
				user.email!,
				twoFactorSecret
			);
			if (
				values.email !== user.email ||
				values.name !== user.name ||
				values.role !== user.role ||
				values.password ||
				values.newPassword
			) {
				return {
					twoFactor: true,
					uri: uri,
					message:
						'Você precisa configurar o autenticador antes de atualizar seus dados, após a configuração realize as outras mudanças.',
				};
			} else {
				return {
					twoFactor: true,
					uri: uri,
					message:
						'Escaneie o QR Code com o aplicativo de autenticação e digite o código gerado para confirmar a configuração do autenticador.',
				};
			}
		}
	}

	await db.update(users).set(values).where(eq(users.id, user.id));

	return { success: 'Dados atualizados com sucesso' };
};
