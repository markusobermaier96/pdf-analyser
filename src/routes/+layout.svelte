<script lang="ts">
	import FileUpload from '@lib/components/FileUpload.svelte';
	import '../app.css';
	import detectEthereumProvider from '@metamask/detect-provider';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { ethereum, isMetamaskInstalled, selectedDocument } from '@lib/store/globalStore';
	import { user } from '@lib/store/userStore';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { Item, get } from '@lib/utils/metamask';
	import type { JsonRpcSigner } from 'ethers';
	import User from '@lib/components/User.svelte';
	import toast from 'svelte-french-toast';
	import type { Config } from '@sveltejs/adapter-vercel';

	export const config: Config = {
		runtime: 'nodejs18.x'
	};

	let metamaskPending = writable(false);
	onMount(async () => {
		if (data.user) {
			user.set(JSON.parse(data.user));
		}
		if (data.document) {
			selectedDocument.set(JSON.parse(data.document));
		}
		await checkMetamaskInstalled().then(() => {
			ethereum.set(window.ethereum);
		});
	});

	const navigation = [
		{
			name: 'Chat',
			href: '/'
		},
		{
			name: 'About',
			href: '/about'
		},
		{
			name: 'Pricing',
			href: '/costs'
		}
	];

	async function signNonce(nonce: string) {
		const userAddress = $ethereum?.selectedAddress;

		let signer = (await get(Item.Signer)) as JsonRpcSigner;
		const signedMessage = await signer.signMessage(nonce);

		await fetch('/auth', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userAddress,
				signedMessage
			})
		}).then(async (res) => user.set(await res.json()));
	}

	async function checkMetamaskInstalled() {
		await detectEthereumProvider().then((val) => {
			isMetamaskInstalled.set(!!val?.isMetaMask);
		});
	}
	export let data: PageData;
</script>

{#if $user?.publicAddress}
	<FileUpload publicAddress={$user.publicAddress} />
{/if}
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
					class="btn {!($isMetamaskInstalled && $user?.token) ? 'btn-disabled' : ''}"
					>Upload PDF</label
				>
				{#if $user?.token}
					<User />
				{:else}
					<form
						action="/auth?/login"
						method="POST"
						use:enhance={async (event) => {
							metamaskPending.set(true);
							await $ethereum
								?.request({
									method: 'eth_requestAccounts'
								})
								.then(() => event.data.set('user', $ethereum?.selectedAddress ?? ''))
								.catch(() => {
									event.cancel();
								});
							return async ({ result }) => {
								if (result.type == 'success') {
									await signNonce(result.data?.nonce)
										.then(() => {
											toast.success('Logged in');
										})
										.catch((err) => {
											if (err.reason == 'rejected') {
												toast.error('Login request rejected');
											} else {
												toast.error('Unknown Error occured');
											}
										});
								} else {
									toast.error('Internal error occured');
								}
								metamaskPending.set(false);
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

	<main class="flex w-full flex-1 flex-col">
		<slot />
	</main>
	<footer class="m-auto p-4 text-gray-400">
		<div>Powered by OpenAI GPT-3.5-turbo and Pinecone.</div>
	</footer>
</div>
