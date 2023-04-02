<script>
	import AttachWallet from '@lib/components/AttachWallet.svelte';
	import FileUpload from '@lib/components/FileUpload.svelte';
	import Payment from '@lib/components/Payment.svelte';
	import '../app.css';
	import detectEthereumProvider from '@metamask/detect-provider';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const navigation = [
		{
			name: 'Home',
			href: '/#'
		},
		{
			name: 'About',
			href: '/#'
		}
	];

	let isMetamaskInstalled = writable(false);
	async function checkMetamaskInstalled() {
		await detectEthereumProvider().then((val) => {
			isMetamaskInstalled.set(!!val?.isMetaMask ?? false);
		});
	}

	onMount(checkMetamaskInstalled);
	export let data;
</script>

{#if data.user}
	<Payment />
{:else}
	<FileUpload />
	<AttachWallet />
{/if}
<FileUpload />
<div class="container w-[75vw] mx-auto flex flex-col space-y-4">
	<header class="">
		<div class="flex h-16 border-b border-b-slate-200 py-4">
			<nav-left class="ml-4 flex self-center">
				<ul class="flex space-x-4">
					{#each navigation as item}
						<li>
							<a href={item.href} class="hover:text-slate-600 cursor-pointer">
								{item.name}
							</a>
						</li>
					{/each}
				</ul>
			</nav-left>
			<brand-name
				class="hidden lg:flex text-2xl font-bold font-serif absolute left-1/2 transform -translate-x-1/2"
				>PDF Analyser</brand-name
			>
			<nav-right class="self-center flex justify-end w-full mr-4 space-x-12">
				<label for="file-upload" class="btn {!$isMetamaskInstalled ? 'btn-disabled' : ''}"
					>Upload PDF</label
				>
				{#if data.user}
					<label for="my-modal-3" class="btn">Pay with Crypto</label>
				{:else}
					<label
						for="wallet"
						class="btn {!$isMetamaskInstalled ? 'btn-disabled cursor-not-allowed' : ''}"
						>Attach Wallet</label
					>
				{/if}
			</nav-right>
		</div>
	</header>

	<main class="flex w-full flex-1 flex-col overflow-hidden">
		<slot isMetamaskInstalled={$isMetamaskInstalled} />
	</main>
	<footer class="m-auto p-4 text-gray-400">
		<div>Powered by LangChainAI.</div>
	</footer>
</div>

<style lang="postcss">
</style>
