<script lang="ts">
	import { writable } from 'svelte/store';
	import toast, { Toaster } from 'svelte-french-toast';
	import { SSE } from 'sse.js';
	import ChatMessage from '@lib/components/ChatMessage.svelte';
	import { isMetamaskInstalled } from '@lib/store/globalStore';
	import { userToken } from '@lib/store/userStore';
	import { appendMessage, messageStore } from '@lib/store/messageStore';
	import mechanicalClick from '@lib/assets/sounds/mechanical-click3.mp3';

	let loading = writable(false);
	let blocked = writable(false);
	// scroll to bottom function
	let scrollToDiv: HTMLDivElement;
	function scrollToBottom() {
		setTimeout(function () {
			scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
		}, 100);
	}

	// handle error function
	function handleError<T>(err: T) {
		loading.set(false);
		$messageStore.query = '';
		toast.error(JSON.parse(err.data).message);
	}

	// handle form submission
	const handleSubmit = async () => {
		// first checks
		if (!$userToken) {
			appendMessage('It seems that you are not logged in. Please do that first.', 'system');
			// if user token is not set, set blocked to true to prevent more user input until the user has logged in
			userToken.subscribe((value) => {
				blocked.set(!value);
			});
			return;
		}
		blocked.set(false);
		if (!$messageStore.query) {
			toast.error('Please input a question.');
			return;
		}

		// then prepares query
		let query = $messageStore.query.trim().replaceAll('\n', ' ');
		$messageStore.query = undefined;

		// append query to message cloud
		appendMessage(query, 'user');
		loading.set(true);

		// initialized the pending
		messageStore.update((state) => ({ ...state, pending: '' }));

		// starts the Server Sent Events
		const eventSource = new SSE('/api/chatexample', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ messages: $messageStore })
		});
		eventSource.addEventListener('error', handleError);
		eventSource.addEventListener('message', (e) => {
			scrollToBottom();
			try {
				if (JSON.parse(e.data) === '[DONE]') {
					appendMessage($messageStore.pending!, 'assistant');
					loading.set(false);
					return;
				}

				const data = JSON.parse(e.data);
				messageStore.update((state) => ({
					...state,
					pending: (state.pending ?? '') + data
				}));

				const audio = new Audio(mechanicalClick);
				audio.play();
			} catch (err) {
				handleError(err);
			}
		});
		eventSource.stream();
		scrollToBottom();
	};
</script>

<Toaster />
<div class="mx-auto flex flex-col gap-4">
	<main class="main">
		<!-- Cloud -->
		<div class="flex w-[75vw] h-[65vh] border rounded-lg justify-center text-center">
			<div class="w-full h-full overflow-y-scroll rounded-lg shadow-md">
				{#if !$isMetamaskInstalled}
					<ChatMessage
						role="assistant"
						content="I cant find Metamask in your browser. To use this application, you need to install [Metamask](https://metamask.io/) first!"
					/>
				{/if}
				{#each $messageStore.messages as { role, content }, i}
					<ChatMessage {role} {content} />
				{/each}
				{#if $messageStore.pending}
					<ChatMessage role="assistant" content={$messageStore.pending} />
				{/if}
				<div class="" bind:this={scrollToDiv} />
			</div>
		</div>

		<!-- User Input -->
		<div class="center">
			<div class="relative">
				<form method="POST" on:submit|preventDefault={handleSubmit}>
					<textarea
						disabled={$loading || $blocked}
						bind:value={$messageStore.query}
						rows={1}
						maxLength={512}
						id="userInput"
						name="userInput"
						placeholder={$loading ? 'Waiting for response...' : 'What is this pdf about?'}
						class="relative w-[75vw] border border-gray-200 rounded-lg outline-none text-lg px-8 py-4 resize-none"
						on:keydown={(event) => {
							if (event.key === 'Enter') {
								event.preventDefault();
								document.getElementById('formbutton')?.click();
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

<!-- ------------------------------ -->
<svelte:head>
	<title>Home • PDF Analyser</title>
</svelte:head>

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

	.generatebutton:hover {
		background: #e4575726;
		border-radius: 0.2rem;
	}

	.generatebutton:disabled {
		opacity: 0.9;
		cursor: not-allowed;
		background: none;
	}

	@keyframes loading-gradient {
		0% {
			background-position: -100% 0;
		}
		100% {
			background-position: 100% 0;
		}
	}

	.center {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		padding: 1rem 0;
		flex-direction: column;
	}

	/* Mobile optimization */
	@media (max-width: 600px) {
		.main {
			padding: 1rem;
			max-height: 90vh;
		}
	}
</style>
