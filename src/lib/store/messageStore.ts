import { writable } from 'svelte/store';
import type { ChatCompletionRequestMessage, ChatCompletionResponseMessageRoleEnum } from 'openai';

interface Message extends ChatCompletionRequestMessage {
	err?: boolean;
}

interface MessageStore {
	messages: Message[];
}

export const messageStore = writable<MessageStore>({
	messages: [
		{
			content: 'Hi, I am your pdf analysis assistant. How can I help you?',
			role:  'assistant',
		}
	],
});

export const appendMessage = (content: string, role: ChatCompletionResponseMessageRoleEnum, err?: boolean) => {
	messageStore.update((store) => {
		return {
			...store,
			messages: [
				...store.messages,
				{
					content,
					role,
					err
				}
			]
		};
	});
};

