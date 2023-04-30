import { writable } from 'svelte/store';

interface User {
	publicAddress: string;
	nonce: string;
	createdAt: string;
	updatedAt: string;
}

export const user = writable<User | null>(null);
export const userToken = writable<string | null>(null);
