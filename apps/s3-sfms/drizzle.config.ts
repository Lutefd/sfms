import { type Config } from 'drizzle-kit';

import { env } from '@/env';

export default {
	schema: './server/db/schema.ts',
	driver: 'turso',
	dbCredentials: {
		// connectionString: env.DATABASE_URL,

		url: env.DB_URL,

		//#ts-ignore - ssl is not in the types
	},
	tablesFilter: ['dz_*'],
	out: './drizzle',
} satisfies Config;
