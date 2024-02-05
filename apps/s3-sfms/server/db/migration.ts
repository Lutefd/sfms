import { migrate } from 'drizzle-orm/libsql/migrator';
import 'dotenv/config';
import { LibSQLDatabase, drizzle } from 'drizzle-orm/libsql';
import { Client, createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '@/env';
const client = createClient({
	url: env.DB_URL,
	authToken: env.DB_AUTH_TOKEN,
});
export const db = drizzle(client, {
	schema,
});

async function main() {
	const sql = createClient({
		url: env.DB_URL,
		authToken: env.DB_AUTH_TOKEN,
	});

	const db = drizzle(sql);
	await migrateDb(db, sql);
}

async function migrateDb(
	db: LibSQLDatabase<Record<string, unknown>>,
	sql: Client
) {
	await migrate(db, { migrationsFolder: 'drizzle' });
	await sql.close();
}

main();
