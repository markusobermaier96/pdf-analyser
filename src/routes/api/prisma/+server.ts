import { prisma } from '@lib/server/prisma';
import crypto from 'crypto';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, params }) => {
	const account = await request
		.json()
		.then((data: string) => {
			return data;
		})
		.catch(() => {
			throw new Error('No request data');
		});

	const user = await prisma.user.findUnique({
		where: {
			publicAddress: account
		}
	});

	let nonce;
	if (!user) {
		nonce = crypto.randomBytes(16).toString('hex');
		let user_model = {
			publicAddress: account,
			nonce: nonce
		};
		await prisma.user
			.create({
				data: user_model
			})
			.then(() => {
				console.log('created user');
				return new Response('Account registered', { status: 200 });
			})
			.catch((err) => {
				console.log(err);
			});
	} else {
		nonce = user.nonce;
		console.log('user already exists');
	}

	return new Response(String(nonce));
};
