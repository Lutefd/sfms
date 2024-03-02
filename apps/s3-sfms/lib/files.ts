'use server';
import { db } from '@/server/db';
import { files } from '@/server/db/schema';
import { and, eq, ilike, like } from 'drizzle-orm';

export const getFourMostRecentFilesFromUserId = async (userId: string) => {
	const result = await db.query.files.findMany({
		where: eq(files.ownerId, userId),
		limit: 4,
		orderBy: (files, { desc }) => [desc(files.createdAt)],
	});
	return result;
};

export const getAllImagesFromUserId = async () => {
	const result = await db.query.files.findMany({
		where: like(files.type, '%image%'),
	});

	return result;
};
