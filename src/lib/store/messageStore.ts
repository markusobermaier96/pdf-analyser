import { writable } from 'svelte/store';
import type { ChatCompletionRequestMessage, ChatCompletionResponseMessageRoleEnum } from 'openai';

export const messageStore = writable<ChatCompletionRequestMessage[]>([{
	content: 'Hi, I am your pdf analysis assistant. How can I help you?',
	role:  'assistant',
}])

export const appendMessage = (content: string, role: ChatCompletionResponseMessageRoleEnum) => {
	messageStore.update((store) => {
		return [
			...store,
			{
				content,
				role
			}
		];
	});
}