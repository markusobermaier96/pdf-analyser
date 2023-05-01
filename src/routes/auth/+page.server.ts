import { prisma } from '@lib/server/prisma';
import { error, type Actions } from '@sveltejs/kit';
import crypto from 'crypto';

export const actions: Actions = {
	login: async ({ cookies, request }) => {
		const userAddress = await request.formData().then((data) => {
			return data.get('user') as string;
		});
		if (!userAddress) {
			throw error(500, 'No user data');
		}

		// set cookie
		if (!cookies.get('metamask_address')) {
			cookies.set('metamask_address', userAddress);
		}

		// retrieve user from db
		const user = await prisma.user
			.findUnique({
				where: {
					publicAddress: userAddress
				}
			})
			.catch(() => {
				throw error(500, 'Could not retrieve user from db');
			});

		/* create new user if he is not registered yet and return nonce to frontend */
		let nonce;
		if (!user) {
			nonce = crypto.randomBytes(16).toString('hex');
			let user_model = {
				publicAddress: userAddress,
				nonce: nonce
			};
			await prisma.user
				.create({
					data: user_model
				})
				.then(() => {
					console.log('created user');
					return { success: true };
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			nonce = user.nonce;
			console.log('user already exists');
		}
		return {
			nonce: nonce
		};
	},

	logout: async ({ cookies }) => {
		if (cookies.get('token')) {
			cookies.delete('token');
		}
	}
};
