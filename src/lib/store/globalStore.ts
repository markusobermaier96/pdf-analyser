import type { MetaMaskInpageProvider } from '@metamask/providers';
import { writable } from 'svelte/store';

type Document = {
	title: string;
	index: string;
};

export const ethereum = writable<MetaMaskInpageProvider | undefined>();
export const isMetamaskInstalled = writable();
export const selectedDocument = writable<Document>();
