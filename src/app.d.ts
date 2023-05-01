import { MetaMaskInpageProvider } from '@metamask/providers';
import type { PrismaClient } from '@prisma/client';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	interface Window {
		ethereum: MetaMaskInpageProvider;
	}
	//var prisma: PrismaClient;
}

export {};
