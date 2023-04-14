import type { LayoutServerLoad } from './$types';
import { prisma } from '@lib/server/prisma';

export const load: LayoutServerLoad = async ({ cookies }) => {
	if (cookies.get('metamask_address')) {
		const { nonce } = await prisma.user.findUnique({
			where: { publicAddress: cookies.get('metamask_address') },
			select: { nonce: true }
		});
		return {
			nonce: nonce
		};
	}
};
