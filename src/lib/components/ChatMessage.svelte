<script lang="ts">
	//import MarkdownIt from 'markdown-it';
	import { getMarkdownIt } from '@lib/utils/markdownit';
	import type { ChatCompletionRequestMessageRoleEnum } from 'openai';

	export let role: ChatCompletionRequestMessageRoleEnum;
	export let content: string;
</script>

<div
	class="flex items-center p-3 border-b m-2 {role === 'assistant' ? 'bg-gray-100' : ''} {role ===
	'system'
		? 'bg-orange-200 shadow-none'
		: ''}"
>
	{#if role === 'user'}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-7 mr-4"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
			/>
		</svg>
	{:else if role === 'system'}
		<i class="w-8 mr-4 fa-solid fa-circle-info" />
	{:else}
		<img class="w-8 mr-4" src="bot-image.png" alt="bot-icon" />
	{/if}
	{@html getMarkdownIt().render(content)}
</div>
