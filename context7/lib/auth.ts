import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';

export const auth = betterAuth({
	database: new Database('./better-auth.sqlite'),
	secret: process.env.BETTER_AUTH_SECRET || 'your-secret-key-change-this',
	baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		},
	},
	trustedOrigins: ['http://localhost:3000'],
});
