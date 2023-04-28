import { writable } from 'svelte/store';

interface User {
    id: number;
    publicAddress: string;
    name: string | null;
    email: string | null;
    nonce: string;
    createdAt: string;
    updatedAt: string;
  }
  

export const user = writable<User | null>(null);
export const userToken = writable<string | null>(null);
