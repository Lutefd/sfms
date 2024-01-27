'use server';
import { validateRequest } from '@/server/auth';
import brcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { decodeBase64, encodeBase64 } from 'oslo/encoding';
export const updateSession = async () => {
	const { user, session } = await validateRequest();
	const stringfiedUser = JSON.stringify(user);
	const data = new TextEncoder().encode(stringfiedUser);
	const encodedUser = encodeBase64(data);

	cookies().set('userSession', encodedUser, {
		secure: process.env.NODE_ENV !== 'development',
		sameSite: 'strict',
	});
};

export const readSession = async () => {
	const userSession = cookies().get('userSession');
	if (!userSession) {
		return null;
	}
	const decodedUserSession = decodeBase64(userSession?.value);
	const decodedUser = new TextDecoder().decode(decodedUserSession);
	const user = JSON.parse(decodedUser);
	return user;
};
