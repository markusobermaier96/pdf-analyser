import { writable } from 'svelte/store';

interface MessageStore {
	messages: {
		message: string;
		type: 'apiMessage' | 'userMessage';
		err?: boolean;
	}[];
	history: [string, string][];
}

export const messageStore = writable<MessageStore>({
	messages: [
		{
			message: 'What would you like to know?',
			type: 'apiMessage'
		}
	],
	history: []
});
