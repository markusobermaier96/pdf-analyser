<script lang="ts">
	import { applyAction, deserialize, enhance, type SubmitFunction } from '$app/forms';
	import { messageStore } from '@store/messageStore';
	import MarkdownIt from 'markdown-it';
	import { writable } from 'svelte/store';
	import toast, { Toaster } from 'svelte-french-toast';
	import type { ActionResult } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';

	const md = new MarkdownIt();

	let loading = writable(false);
	let query = writable('');

	//handle form submission
	const handleSubmit: SubmitFunction = async ({ action, cancel }) => {
		// if no user input, dont call server and return
		if (!$query) {
			toast.error('Please input a question.');
			cancel();
			return;
		}

		const question = $query.trim();

		// update store with users query
		messageStore.update((state) => ({
			...state,
			messages: [
				...state.messages,
				{
					type: 'userMessage',
					message: question
				}
			]
		}));
		loading.set(true);

		const data = new FormData();
		data.append('query', question);
		data.append('history', JSON.stringify($messageStore.history));

		const response = await fetch(action, {
			method: 'POST',
			body: data
		});

		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			// re-run all `load` functions, following the successful update
			toast.success('Received Request');

			// Update store with KI generated response
			messageStore.update((state) => ({
				history: [...state.history, [question, '']],
				messages: [
					...state.messages,
					{
						type: 'apiMessage',
						message: JSON.parse(JSON.stringify(result.data))
					}
				],
				pending: undefined,
				pendingSourceDocs: undefined
			}));
			await invalidateAll();
		} else {
			toast.error('Something went wrong!');
		}

		applyAction(result);
	};
</script>

<Toaster />
<div class="mx-auto flex flex-col gap-4">
	<!-- Überschrift -->
	<h1 class="text-2xl font-bold leading-[1.1] tracking-tighter text-center">Analyze your PDF</h1>

	<main class="main">
		<!-- Cloud -->
		<div class="flex w-[75vw] h-[65vh] border rounded-lg justify-center text-center">
			<div class="w-full h-full overflow-y-scroll rounded-lg shadow-md">
				{#each $messageStore.messages as { message, type }, i}
					<div
						class={type === 'apiMessage'
							? 'flex items-center p-3 bg-gray-100'
							: 'flex items-center p-3 bg-blue-100'}
					>
						{#if type === 'apiMessage'}
							<img class="w-8 h-8 mr-4" src="bot-image.png" alt="bot-icon" />
							<div>
								{@html md.render(message)}
							</div>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-8 h-8 mr-4"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
								/>
							</svg>

							<div class={$loading && i === $messageStore.messages.length - 1 ? 'flex' : 'flex'}>
								{@html md.render(message)}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- User Input -->
		<div class="center">
			<div class="relative">
				<form method="POST" use:enhance={handleSubmit}>
					<textarea
						disabled={$loading}
						bind:value={$query}
						rows={1}
						maxLength={512}
						id="userInput"
						name="userInput"
						placeholder={$loading ? 'Waiting for response...' : 'What is this pdf about?'}
						class="relative w-[75vw] border border-gray-200 rounded-lg outline-none text-lg px-8 py-4"
						on:keydown={(event) => {
							if (event.key === 'Enter' && !event.shiftKey) {
								event.preventDefault();
								document.getElementById('formbutton')?.click();
							} else if (event.key === 'Enter') {
								event.preventDefault();
							}
						}}
					/>
					<button id="formbutton" disabled={$loading} class="generatebutton">
						{#if $loading}
							...
						{:else}
							<svg
								viewBox="0 0 20 20"
								class="rotate-90 w-5 h-5 fill-current"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
								/>
							</svg>
						{/if}
					</button>
				</form>
			</div>
		</div>
	</main>
</div>

<style>
	textarea:disabled {
		opacity: 0.5;
	}

	textarea:focus {
		outline: none;
		border-color: #6b7280;
		box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.5);
	}

	textarea::placeholder {
		color: #6b7280;
	}

	.generatebutton {
		position: absolute;
		top: 0.87rem;
		right: 1rem;
		color: rgb(165, 162, 162);
		background: none;
		padding: 0.3rem;
		border: none;
		display: flex;
	}

	.loadingwheel {
		position: absolute;
		top: 0.2rem;
		right: 0.25rem;
	}

	.generatebutton:hover {
		background: #e4575726;
		border-radius: 0.2rem;
	}

	.generatebutton:disabled {
		opacity: 0.9;
		cursor: not-allowed;
		background: none;
	}

	.messagelistloading {
		display: flex;
		width: 100%;
		justify-content: center;
		margin-top: 1rem;
	}

	.usermessage {
		background: #ffffff;
		padding: 1.5rem;
		color: #000;
	}

	.usermessagewaiting {
		padding: 1.5rem;
		color: #000;
		background: linear-gradient(to left, #07080938, #1a1c2024, #07080936);
		background-size: 200% 200%;
		background-position: -100% 0;
		animation: loading-gradient 2s ease-in-out infinite;
		animation-direction: alternate;
		animation-name: loading-gradient;
	}

	@keyframes loading-gradient {
		0% {
			background-position: -100% 0;
		}
		100% {
			background-position: 100% 0;
		}
	}

	.apimessage {
		background: #f9fafb;
		padding: 1.5rem;
		color: #000;
		animation: fadein 0.5s;
	}

	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.markdownanswer {
		line-height: 1.75;
	}

	.markdownanswer a:hover {
		opacity: 0.8;
	}

	.markdownanswer a {
		color: #b13a3a;
		font-weight: 500;
	}

	.markdownanswer code {
		color: #15cb19;
		font-weight: 500;
		white-space: pre-wrap !important;
	}

	.markdownanswer ol,
	.markdownanswer ul {
		margin: 1rem;
	}

	.markdownanswer h1,
	.markdownanswer h2,
	.markdownanswer h3 {
		font-size: inherit;
	}

	.center {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		padding: 1rem 0;
		flex-direction: column;
	}

	.pointsnormal {
		width: 90%;
		height: 90%;
	}

	.pointsdim {
		width: 90%;
		height: 90%;
		opacity: 0.25;
	}

	/* Mobile optimization */
	@media (max-width: 600px) {
		.main {
			padding: 1rem;
			max-height: 90vh;
		}

		.cloud {
			width: 22rem;
			height: 28rem;
		}
		.textarea {
			width: 22rem;
		}
		.topnav {
			border: 1px solid black;
			align-items: center;
			padding: 0.85rem 0.75rem 0.85rem 0.75rem;
		}

		.navlogo {
			font-size: 1.25rem;
			width: 20rem;
		}

		.markdownanswer code {
			white-space: pre-wrap !important;
		}
	}
</style>
