import { prisma } from '@lib/server/prisma';
import crypto from 'crypto';

export const POST = async ({ request }) => {
	const account = await request
		.json()
		.then((data: string) => {
			return data;
		})
		.catch(() => {
			throw new Error('No request data');
		});
	console.log(account);

	let user_model = {
		publicAddress: account,
		nonce: crypto.randomBytes(16).toString('hex')
	};
	await prisma.user.create({
		data: user_model
	}).then(() => console.log("created user"));

	return new Response('Account registered', { status: 200 });
};
