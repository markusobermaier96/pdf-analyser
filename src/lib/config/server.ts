/* eslint-disable @typescript-eslint/no-redeclare */
import { z } from 'zod';
// eslint-disable-next-line no-restricted-imports
import * as environment from '$env/static/private';

export const ServerConfigSchema = z.object({
	OPENAI_API_KEY: z.string().trim().min(1),
	HF_ACCESS_TOKEN: z.string().trim().min(1),
	HUGGINGFACEHUB_API_TOKEN: z.string().trim().min(1),
	PINECONE_API_KEY: z.string().trim().min(1),
	PINECONE_ENVIRONMENT: z.string().trim().min(1),
	PINECONE_INDEX_NAME: z.string().trim().min(1),
	PUBLIC_METAMASK_ADDRESS: z.string().trim().min(1),
	REDIS_PORT: z.number().default(6379),
	REDIS_URL: z.string().trim().min(1).url(),
	DB_HOST: z.string().trim().min(1),
	DB_USER: z.string().trim().min(1),
	DB_PASSWORD: z.string().trim().min(1),
	DB_NAME: z.string().trim().min(1),
	DB_PORT: z.number().default(5432),
	DATABASE_URL: z.string().trim().min(1).url(),
	JWT_SECRET: z.string().trim().min(10)
});

export type ServerConfigSchema = z.infer<typeof ServerConfigSchema>;

export const config = ServerConfigSchema.parse(environment);
