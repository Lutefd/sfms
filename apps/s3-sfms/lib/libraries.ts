import { db } from '@/server/db';
import { libraries } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const getLibrariesByUserId = async (userId: string) => {
	const result = await db.query.libraries.findMany({
		where: eq(libraries.ownerId, userId),
	});
	return result;
};
