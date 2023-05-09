import type { LayoutServerLoad } from './$types';
import { prisma } from '@lib/server/prisma';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const token = cookies.get('token');
	const user = cookies.get('user');
	const metamaskAddress = cookies.get('metamask_address');
	const document = cookies.get('document')

	if (token) {
		if (user && document) {
			return { token: token, user: user, document: document };
		} else if (user) {
			return { token: token, user: user };
		}
		return { token: token };
	} else if (metamaskAddress) {
		const user = await prisma.user
			.findUnique({
				where: { publicAddress: metamaskAddress },
				select: { nonce: true }
			})
			.catch(() => {
				//throw error(500, 'Could not retrieve user from db');
				console.log('Could not retrieve user from db. Not existent');
			});
		return { nonce: user?.nonce ?? '' };
	}
};
