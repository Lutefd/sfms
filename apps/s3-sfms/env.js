import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		DB_URL: z
			.string()
			.url()
			.refine(
				(str) => !str.includes('YOUR_DB_URL_HERE'),
				'You forgot to change the default URL'
			),
		DB_AUTH_TOKEN: z.string().default(''),
		BUILD_STATUS: z.enum(['building', 'live']).default('live'),
		NODE_ENV: z
			.enum(['development', 'test', 'production'])
			.default('development'),
		SES_SECRET_ACCESS_KEY: z.string().default(''),
		SES_ACCESS_KEY_ID: z.string().default(''),
		SES_EMAIL: z.string().default(''),
		CLOUDFRONT_URL: z.string().default(''),
		S3_BUCKET: z.string().default(''),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		// NEXT_PUBLIC_CLIENTVAR: z.string(),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		BUILD_STATUS: process.env.BUILD_STATUS,
		DB_URL: process.env.DB_URL,
		NODE_ENV: process.env.NODE_ENV,

		GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		SES_SECRET_ACCESS_KEY: process.env.SES_SECRET_ACCESS_KEY,
		SES_ACCESS_KEY_ID: process.env.SES_ACCESS_KEY_ID,
		SES_EMAIL: process.env.SES_EMAIL,
		CLOUDFRONT_URL: process.env.CLOUDFRONT_URL,
		S3_BUCKET: process.env.S3_BUCKET,
		DB_AUTH_TOKEN: process.env.DB_AUTH_TOKEN,

		// NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	/**
	 * Makes it so that empty strings are treated as undefined.
	 * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,
});
