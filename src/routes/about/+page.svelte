<script lang="ts">
	import { dataLength } from 'ethers';
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

	<div class="my-6" />
	<ul class="space-y-6">
		<div class="font-bold flex justify-center bg-slate-100 p-2">Authentication process</div>
		<ul class="inner">
			<li>Log in with your Metamask account</li>
			<li>This will also create your account, if you use the application for the first time</li>
			<li>To Log In to the application, you will be prompted with a "Sign" message</li>
		</ul>
		<br />
		<div class="font-bold flex justify-center bg-slate-100 p-2">How to use the application</div>
		<ul class="inner">
			<li>
				Upload a PDF
			</li>
			<li>
				Choose an option:
				<ul class="font-light">
					<li>free (less optimized model)</li>
					<li>payed (Powered by OpenAi)</li>
				</ul>
			</li>
			<li>
				Once you've selected your chatbot model, you can start interacting with it by asking
				questions about the content of your PDF file. The chatbot will analyze the text and provide
				you with helpful answers.
			</li>
			<li>
				If you need to change the chatbot model you selected, you can do so at any time by clicking
				the "Change Model" button.
			</li>
		</ul>
	</ul>
</div>

<!-- ------------------------------ -->
<svelte:head>
	<title>About • PDF Analyser</title>
</svelte:head>

<style lang="postcss">
	.outer {
		@apply border border-black rounded shadow-lg p-7;
	}

	.inner {
		@apply text-center space-y-2 border border-black rounded shadow-lg p-7;
	}
</style>
