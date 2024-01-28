'use server';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '@/env';
import { validateRequest } from '@/server/auth';
import { dbPromise } from '@/server/db';
import { files, users } from '@/server/db/schema';
import { generateId } from 'lucia';
import { updateSession } from './session';

const s3 = new S3Client({
	credentials: {
		accessKeyId: env.SES_ACCESS_KEY_ID!,
		secretAccessKey: env.SES_SECRET_ACCESS_KEY!,
	},
	region: 'sa-east-1',
	apiVersion: 'latest',
});

export const generatePresignedUrl = async (name: string, format: string) => {
	const { session, user } = await validateRequest();
	if (!session) {
		return {
			error: 'Sessão não encontrada',
		};
	}
	const command = new PutObjectCommand({
		Key: 'users/' + `${format}/` + name,
		Bucket: 's3-sfms',
	});
	const url = await getSignedUrl(s3, command, {
		expiresIn: 60,
	});
	return { url };
};

interface File {
	name: string;
	format: string;
	size: number;
	key: string;
}
export const saveFileToDb = async ({ name, format, size, key }: File) => {
	const db = await dbPromise;
	const { session, user } = await validateRequest();
	if (!session) {
		return {
			error: 'Sessão não encontrada',
		};
	}
	const url = `${env.CLOUDFRONT_URL}/users/${format}/${key}`;
	const file = {
		id: generateId(15),
		title: name,
		url: url,
		ownerId: user.id,
		size: Number(size),
		type: format,
	};
	await db.insert(files).values(file);
	await db.update(users).set({
		current_quota_use: user.current_quota_use + size,
	});
	await updateSession();
};
