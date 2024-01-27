'use server';
import { RegisterSchema } from '@/schemas';
import { z } from 'zod';
import { dbPromise } from '@/server/db';
import { eq } from 'drizzle-orm';
import { users } from '@/server/db/schema';
import { generateVerificationToken } from '@/lib/token';
import { sendVerificationEmail } from './email';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const db = await dbPromise;
	const validateFields = RegisterSchema.safeParse(values);

	if (!validateFields.success) {
		return {
			error: 'Ocorreu um erro ao realizar o cadastro  ',
		};
	}
	const {
		email: inputEmail,
		password,
		name: inputName,
	} = validateFields.data;

	const hashPassword = await new Argon2id().hash(password);

	const existingUser = await db.query.users.findFirst({
		where: eq(users.email, inputEmail),
	});

	if (existingUser) {
		return {
			error: 'Usuário já cadastrado',
		};
	}
	const userId = generateId(15);
	const user = {
		id: userId,
		email: inputEmail,
		password: hashPassword,
		name: inputName,
	};
	await db.insert(users).values(user);
	const verificationToken = await generateVerificationToken(inputEmail);
	console.log(verificationToken);
	await sendVerificationEmail(inputEmail, verificationToken);

	return {
		success: 'Confirmação de cadastro enviada para o email',
	};
};
('');
