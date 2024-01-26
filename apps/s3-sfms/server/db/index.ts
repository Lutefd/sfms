/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { drizzle as drizzleDev, type MySql2Database } from 'drizzle-orm/mysql2';
// import {
// 	drizzle as drizzle,
// 	type PlanetScaleDatabase,
// } from 'drizzle-orm/planetscale-serverless';
import mysql from 'mysql2/promise';

import { env } from '@/env';

import * as myschema from '@/server/db/schema';

export interface Global {
	cachedDbPromise: MySql2Database<typeof myschema> | null;
}

async function connectToDatabase() {
	if ((globalThis as any).cachedDbPromise) {
		console.log('using cached db');
		return (globalThis as any).cachedDbPromise as MySql2Database<
			typeof myschema
		>;
	}
	console.log('connecting to db');
	const client = await mysql.createConnection({
		host: env.DB_HOST,
		port: 3306,
		user: env.DB_USER,
		password: env.DB_PASSWORD,
		database: env.DB_DATABASE,
	});
	(globalThis as any).cachedDbPromise = drizzleDev(client, {
		schema: myschema,
		mode: 'default',
	});
	return (globalThis as any).cachedDbPromise as MySql2Database<
		typeof myschema
	>;
}

const authQueryClient = mysql.createPool({
	host: env.DB_HOST,
	port: 3306,
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_DATABASE,
});

export const authDb = drizzleDev(authQueryClient, {
	schema: myschema,
	mode: 'default',
	logger: true,
});

export const dbPromise = connectToDatabase();
