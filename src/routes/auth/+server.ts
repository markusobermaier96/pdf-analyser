import { error, type RequestHandler } from '@sveltejs/kit';
import { ethers } from 'ethers';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { prisma } from '@lib/server/prisma';

export const POST: RequestHandler = async ({ request, cookies }) => {
	// get data
	const { signedMessage, userAddress } = await request.json();

	if (!(signedMessage && userAddress)) {
		throw error(500, 'something went wrong');
	}

	// get user
	const user = await prisma.user
		.findUnique({
			where: {
				publicAddress: userAddress
			}
		})
		.catch(() => {
			throw error(500, 'Could not retrieve user from db');
		});

	// verify signature
	if (ethers.verifyMessage(user!.nonce, signedMessage).toLowerCase() !== userAddress) {
		return new Response('Invalid signature', { status: 401 });
	}

	// update user
	const updatedUser = await prisma.user.update({
		where: {
			publicAddress: userAddress
		},
		data: {
			nonce: crypto.randomBytes(16).toString('hex')
		}
	});

	const token = jwt.sign(
		{
			address: updatedUser.publicAddress
		},
		JWT_SECRET,
		{ expiresIn: '6h' }
	);

	cookies.set('token', token, {
		// sets the cookie to expire in 6 hours
		expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
		path: '/'
	});
	cookies.set('user', JSON.stringify(updatedUser), {
		// sets the cookie to expire in 6 hours
		expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
		path: '/'
	});

	const response = {
		msg: 'You are now logged in.'
	};

	return new Response(JSON.stringify(response));
};
