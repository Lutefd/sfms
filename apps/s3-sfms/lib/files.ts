import { dbPromise } from '@/server/db';
import { files } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const getFourMostRecentFilesFromUserId = async (userId: string) => {
	const db = await dbPromise;

	const result = await db.query.files.findMany({
		where: eq(files.ownerId, userId),
		limit: 4,
		orderBy: (files, { desc }) => [desc(files.createdAt)],
	});
	return result;
};
