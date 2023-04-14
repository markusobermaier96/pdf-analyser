import type { Actions, PageServerLoad } from './$types';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import { error } from '@sveltejs/kit';
import { prisma } from '@lib/server/prisma';

export const actions: Actions = {
	upload: async ({ request }) => {
		const fileField = await request.formData().then((data) => {
			return data.get('pdf');
		});
		//const fileField = data.get('pdf'); // value of 'name' attribute of input
		if (!fileField || !(fileField instanceof File)) {
			throw error(404, {
				message: 'Couldnt upload file: No proper format.'
			});
		}
		const fileBuffer = await fileField.arrayBuffer();
		const filePath = `./docs/${fileField.name}`;
		await fs
			.writeFile(filePath, Buffer.from(fileBuffer))
			.then((_) => {
				return {
					status: 200,
					body: 'PDF file uploaded successfully'
				};
			})
			.catch(() => {
				throw error(404, {
					message: 'Couldnt upload file: Internal server error occured'
				});
			});
	},

	authenticate: async ({ cookies, request }) => {
		const userAddress = await request.formData().then((data) => {
			return data.get('user') as string;
		});
		if (!userAddress) {
			throw error(404, {
				message: 'No user data'
			});
		}
		if (!cookies.get('address')) cookies.set('metamask_address', userAddress);

		// retrieve user from db
		const user = await prisma.user.findUnique({
			where: {
				publicAddress: userAddress
			}
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
					return new Response('Account registered', { status: 200 });
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
	}
};
