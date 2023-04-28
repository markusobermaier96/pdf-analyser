import type { LayoutServerLoad } from './$types';
import { prisma } from '@lib/server/prisma';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies }) => {
	if (cookies.get('token')) {
		/* if (cookies.get('metamask_address')) {
			cookies.delete('metamask_address');
		} */
		if (cookies.get('user')) {
			return { token: cookies.get('token'), user: cookies.get('user') };;
		}
		return { token: cookies.get('token')};
	} else if (cookies.get('metamask_address')) {
		const user = await prisma.user
			.findUnique({
				where: { publicAddress: cookies.get('metamask_address') },
				select: { nonce: true }
			})
			.catch(() => {
				throw error(500, 'Could not retrieve user from db');
			});
		return { nonce: user?.nonce ?? '' };
	}
};
