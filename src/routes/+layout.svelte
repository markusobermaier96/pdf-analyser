<script lang="ts">
	import FileUpload from '@lib/components/FileUpload.svelte';
	import '../app.css';
	import detectEthereumProvider from '@metamask/detect-provider';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { ethereum, isMetamaskInstalled, userToken } from '@lib/store/globalStore';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { Item, get } from '@lib/utils/metamask';
	import type { BrowserProvider, JsonRpcSigner } from 'ethers';
	import User from '@lib/components/User.svelte';
	import toast from 'svelte-french-toast';

	let metamaskPending = writable(false);
	onMount(async () => {
		await checkMetamaskInstalled().then(() => {
			ethereum.set(window.ethereum);
		});
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
			console.log('no nonce data available');
			return;
		}
		const nonce = data.nonce!;
		const userAddress = $ethereum?.selectedAddress;

		let signer = (await get(Item.Signer)) as JsonRpcSigner;
		const signedMessage = await signer.signMessage(nonce);

		await fetch('/api/auth', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userAddress,
				signedMessage
			})
		})
			.then(async (res) => {
				userToken.set((await res.json()).token);
			})
			.catch(() => {
				console.log('network error occured');
			});
		console.log($userToken);
	}

	async function checkMetamaskInstalled() {
		await detectEthereumProvider().then((val) => {
			isMetamaskInstalled.set(!!val?.isMetaMask);
		});
	}
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
				<label
					for="file-upload"
					class="btn {!($isMetamaskInstalled && $userToken) ? 'btn-disabled' : ''}"
					>Upload PDF</label
				>
				{#if $userToken}
					<User />
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
							return async ({ update }) => {
								await update();
								metamaskPending.set(false);
								await signNonce()
									.then((_) => {
										toast.success('Logged in');
									})
									.catch((err) => {
										console.log(err);
										toast.error(err);
									});
							};
						}}
					>
						<button
							id="auth-button"
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
		<slot />
	</main>
	<footer class="m-auto p-4 text-gray-400">
		<div>Powered by LangChainAI.</div>
	</footer>
</div>
