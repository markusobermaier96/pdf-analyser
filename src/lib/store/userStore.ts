import { writable } from "svelte/store";

interface User {
  publicAddress: string;
  token: string;
}

export const user = writable<User | null>(null);
