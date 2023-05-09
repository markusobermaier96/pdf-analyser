<script lang="ts">
	import { onMount } from 'svelte';
	import Youtube from 'svelte-youtube-embed';

	let mounted = false;

	onMount(() => (mounted = true));
</script>

<div class="text-xl lg:w-1/2 self-center mt-8 p-5">
	{#if mounted}
		<div>
			<Youtube id="YVgfHZMFFFQ" />
		</div>
	{/if}

	<div class="my-6">
		<div class="outer">
			<div class="title">Authentication Process</div>
			<ul class="inner">
				<li>Log in with your Metamask account</li>
				<li>This will also create your account, if you use the application for the first time</li>
				<li>To Log In to the application, you will be prompted with a "Sign" message</li>
			</ul>
		</div>
		<div class="mt-6" />
		<div class="outer">
			<div class="title">How to use the application</div>
			<ul class="inner">
				<li>Upload a PDF</li>
				<li>
					Start interacting with the chatbot by asking questions about the content of your PDF file.
					The chatbot will analyze the text and provide you with helpful answers.
				</li>
				<li>Pay for what you use: Each question costs a small amount of ETH.</li>
			</ul>
		</div>
	</div>
</div>

<!-- ------------------------------ -->
<svelte:head>
	<title>About • PDF Analyser</title>
</svelte:head>

<style lang="postcss">
	.title {
		@apply flex justify-center bg-gray-300 font-bold p-2;
	}
	.outer {
		@apply flex flex-col justify-center border border-black rounded shadow-lg;
	}
	.inner {
		@apply space-y-2 p-10 list-disc;
	}
</style>
