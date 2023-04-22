import { error, type RequestHandler } from '@sveltejs/kit';
import { ethers } from 'ethers';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	// get data
	const { signedMessage, userAddress } = await request.json();
	
	if(!(signedMessage && userAddress)) {
		throw error(500, "something went wrong")
	}

	// get user
	const user = await prisma.user
		.findUnique({
			where: {
				publicAddress: userAddress
			}
		})
		.catch((err) => {
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
			_id: updatedUser.id,
			address: updatedUser.publicAddress
		},
		JWT_SECRET,
		{ expiresIn: '6h' }
	);

	const response = {
		token: `Bearer ${token}`,
		user: {
			updatedUser
		},
		msg: 'You are now logged in.'
	};

	return new Response(JSON.stringify(response), { status: 200 });
};
