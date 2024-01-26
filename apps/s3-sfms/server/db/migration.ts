import { env } from '@/env';
import { MySql2Database, drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import 'dotenv/config';
import mysql from 'mysql2/promise';
async function main() {
	const sql = await mysql.createConnection({
		uri: process.env.DB_URL!,
	});
	const db = drizzle(sql);
	await migrateDb(db, sql);
}

async function migrateDb(
	db: MySql2Database<Record<string, unknown>>,
	sql: mysql.Connection
) {
	await migrate(db, { migrationsFolder: 'drizzle' });
	await sql.end();
}

main();
