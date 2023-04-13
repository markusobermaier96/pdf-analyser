import type { MetaMaskInpageProvider } from '@metamask/providers';
import { writable } from 'svelte/store';

export const ethereum = writable<MetaMaskInpageProvider | undefined>();
export const isMetamaskInstalled = writable();
