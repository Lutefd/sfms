'use server';
import { LoginSchema } from '@/schemas';
import { z } from 'zod';

import { getUserByEmail } from '@/lib/user';
import {
	deleteEmailTwoFactorToken,
	generateEmailTwoFactorToken,
	generateVerificationToken,
} from '@/lib/token';
import { sendTwoFactorEmail, sendVerificationEmail } from './email';
import {
	deleteEmailTwoFactorConfirmation,
	generateEmailTwoFactorConfirmation,
	getEmailTwoFactorConfirmation,
	getEmailTwoFactorTokenByEmail,
} from '@/lib/two-factor-authentication';
import { verifyTOTP } from './totp';
import { Argon2id } from 'oslo/password';
import { lucia, validateRequest } from '@/server/auth';
import { cookies } from 'next/headers';
import { encodeBase64 } from 'oslo/encoding';

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validateFields = LoginSchema.safeParse(values);

	if (!validateFields.success) {
		return {
			error: 'Ocorreu um erro ao realizar o login',
		};
	}
	const { email, password, code } = validateFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.email) {
		return {
			error: 'Usuário não encontrado',
		};
	}
	if (!existingUser.password) {
		return {
			error: 'Tenha certeza que você se cadastrou com o email e senha',
		};
	}
	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(email);
		await sendVerificationEmail(email, verificationToken);
		return {
			success: 'Confirmação de email enviada para o email',
		};
	}

	if (existingUser.two_factor_method == 'EMAIL') {
		if (code) {
			const twoFactorToken = await getEmailTwoFactorTokenByEmail(
				existingUser.email
			);
			if (!twoFactorToken) {
				return {
					error: 'Código de verificação inválido',
				};
			}
			if (twoFactorToken.token !== code) {
				return {
					error: 'Código de verificação inválido',
				};
			}
			const hasExpired = new Date(twoFactorToken.expires) < new Date();
			if (hasExpired) {
				return {
					error: 'Código de verificação expirado',
				};
			}
			await deleteEmailTwoFactorToken(twoFactorToken.id);
			const existingConfirmation = await getEmailTwoFactorConfirmation(
				existingUser.id
			);
			if (existingConfirmation) {
				await deleteEmailTwoFactorConfirmation(existingUser.id);
			}

			await generateEmailTwoFactorConfirmation(existingUser.id);
		} else {
			const token = await generateEmailTwoFactorToken(existingUser.email);
			await sendTwoFactorEmail(existingUser.email, token);
			return {
				twoFactor: true,
			};
		}
	}

	if (existingUser.two_factor_method == 'AUTHENTICATOR') {
		if (code) {
			const result = await verifyTOTP(code, existingUser.id);
			if (result.error) {
				return {
					error: result.error,
				};
			}
		} else {
			return {
				twoFactor: true,
			};
		}
	}
	try {
		const validPassword = await new Argon2id().verify(
			existingUser.password,
			password
		);
		if (validPassword) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies().set(
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes
			);
			const { user } = await validateRequest();
			const stringfiedexistingUser = JSON.stringify(existingUser);
			const data = new TextEncoder().encode(stringfiedexistingUser);
			const encodedexistingUser = encodeBase64(data);

			cookies().set('userSession', encodedexistingUser, {
				secure: process.env.NODE_ENV !== 'development',
				sameSite: 'strict',
			});
			return {
				success: 'Login realizado com sucesso',
				redirect: true,
			};
		}
	} catch (error) {
		return {
			error: 'Senha inválida',
		};
	}
};
