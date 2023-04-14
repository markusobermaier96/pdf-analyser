<script lang="ts">
	import FileUpload from '@lib/components/FileUpload.svelte';
	import '../app.css';
	import detectEthereumProvider from '@metamask/detect-provider';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Metamask from '@lib/components/Metamask.svelte';
	import { ethereum, isMetamaskInstalled } from '@lib/store/globalStore';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { Item, get } from '@lib/utils/metamask';
	import type { BrowserProvider, JsonRpcSigner } from 'ethers';

	let metamaskPending = writable(false);
	onMount(async () => {
		if (isMetamaskInstalled) {
			ethereum.set(window.ethereum);
		}
		await checkMetamaskInstalled();
		await signNonce();
	});

	const navigation = [
		{
			name: 'Home',
			href: '/#'
		},
		{
			name: 'About',
			href: '/about'
		}
	];

	async function signNonce() {
		if (!data.nonce) {
			return;
		}

		let signer = (await get(Item.Signer)) as JsonRpcSigner;
		const signed = await signer.signMessage(data.nonce);
		console.log('nonce: ' + data.nonce);
		console.log('signed nonce ' + signed);
	}

	async function checkMetamaskInstalled() {
		await detectEthereumProvider().then((val) => {
			isMetamaskInstalled.set(!!val?.isMetaMask);
		});
	}

	/* async function connectToMetamask() {
		metamaskPending.set(true);

		// Request access to the user's MetaMask accounts
		await $ethereum?.request({
			method: 'eth_requestAccounts'
		});

		const nonce = await fetch('/api/prisma', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify($ethereum?.selectedAddress)
		})
			.then((res) => {
				return res.json();
			})
			.catch((err) => {
				toast.error('network error occurred');
			})
			.finally(() => metamaskPending.set(false));

		console.log('nonce:' + nonce);
	} */
	export let data: PageData;
</script>

<FileUpload />
<div class="container w-[75vw] mx-auto flex flex-col space-y-4">
	<header>
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
				class="hidden xl:flex text-2xl font-bold font-serif absolute left-1/2 transform -translate-x-1/2"
				>PDF Analyser</brand-name
			>
			<nav-right class="self-center flex justify-end w-full mr-4 space-x-12">
				<label for="file-upload" class="btn {!$isMetamaskInstalled ? 'btn-disabled' : ''}"
					>Upload PDF</label
				>
				{#if $ethereum?.selectedAddress}
					<Metamask />
				{:else}
					<form
						action="?/authenticate"
						method="POST"
						use:enhance={async ({ form, data, action, cancel, submitter }) => {
							metamaskPending.set(true);
							await $ethereum
								?.request({
									method: 'eth_requestAccounts'
								})
								.then(() => data.set('user', $ethereum?.selectedAddress ?? ''))
								.catch((err) => {
									cancel();
								});
							return async ({ result, update }) => {
								console.log(result.data?.nonce);
								metamaskPending.set(false);
								update();
							};
						}}
					>
						<button
							type="submit"
							disabled={$metamaskPending}
							class="btn {!$isMetamaskInstalled ? 'btn-disabled cursor-not-allowed' : ''}"
							>Login with
							<img alt="Metamask" src="metamask-icon.png" class="w-5 ml-2" /></button
						>
					</form>
				{/if}
			</nav-right>
		</div>
	</header>

	<main class="flex w-full flex-1 flex-col overflow-hidden">
		{#if $isMetamaskInstalled}
			<slot />
		{/if}
	</main>
	<footer class="m-auto p-4 text-gray-400">
		<div>Powered by LangChainAI.</div>
	</footer>
</div>
