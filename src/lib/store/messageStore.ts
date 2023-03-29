import { writable } from 'svelte/store';

interface MessageStore {
  messages: {
    message: string;
    type: 'apiMessage' | 'userMessage';
  }[];
  pending?: string;
  history: [string, string][];
  pendingSourceDocs?: Document[];
}

export const messageStore = writable<MessageStore>({
  messages: [
    {
      message: 'Hi, what would you like to learn about this legal case?',
      type: 'apiMessage',
    },
  ],
  history: [],
  pendingSourceDocs: []
});
