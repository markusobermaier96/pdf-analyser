import type { LayoutServerLoad } from './$types';
import { prisma } from '@lib/server/prisma';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies }) => {
	if (cookies.get('metamask_address')) {
		const user = await prisma.user
			.findUnique({
				where: { publicAddress: cookies.get('metamask_address') },
				select: { nonce: true }
			})
			.catch((err) => {
				throw error(500, 'Could not retrieve user from db');
			});
		return { nonce: user?.nonce ?? '' };
	}
};
