import { writable } from "svelte/store";
import type {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessageRoleEnum,
} from "openai";

interface MessageStore {
  messages: ChatCompletionRequestMessage[];
  pending?: string;
  query?: string;
}

/* export const messageStore = writable<ChatCompletionRequestMessage[]>([{
	content: 'Hi, I am your pdf analysis assistant. How can I help you?',
	role:  'assistant',
}]) */

export const messageStore = writable<MessageStore>({
  messages: [
    {
      content: "Hi, I am your pdf analysis assistant. How can I help you?",
      role: "assistant",
    },
  ],
});

export const appendMessage = (
  content: string,
  role: ChatCompletionResponseMessageRoleEnum
) => {
  messageStore.update((store) => {
    store.messages.push({
      content,
      role,
    });
    store.pending = undefined;
    return store;
  });
};
