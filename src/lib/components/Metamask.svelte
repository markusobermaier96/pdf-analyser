<script lang="ts">
	import { onMount } from 'svelte';
	import { BrowserProvider, formatEther, JsonRpcSigner } from 'ethers';
	//import { transactionParameters } from '@lib/config/metamask';
	import type { MetaMaskInpageProvider } from '@metamask/providers';

	let ethereum: MetaMaskInpageProvider;

	let provider: BrowserProvider;
	let signer: JsonRpcSigner;

	let account: string;
	let account_balance_wei: bigint;
	let account_balance_eth: string;
	let blockies: string | null | undefined;

	let amount: number;
	let walletAddress: string;
	let cryptoType: string;

	async function connect() {
		provider = new BrowserProvider(window.ethereum, 'any');
		let accounts = await provider.send('eth_requestAccounts', []);
		account = accounts[0];
		provider.on('accountsChanged', function (accounts) {
			account = accounts[0];
			console.log(address); // Print new address
		});

		signer = await provider.getSigner();

		const address = await signer.getAddress();

		console.log(account);
		console.log(address);
		account_balance_wei = await provider.getBalance('ethers.eth');
		account_balance_eth = formatEther(account_balance_wei).slice(0, 5);
	}

	async function switchNetwork() {
		provider = new BrowserProvider(ethereum, 'any');
		provider.on('network', (newNetwork, oldNetwork) => {
			// When a Provider makes its initial connection, it emits a "network"
			// event with a null oldNetwork along with the newNetwork. So, if the
			// oldNetwork exists, it represents a changing network
			if (oldNetwork) {
				window.location.reload();
			}
		});
	}

	onMount(connect);
</script>

<div class="self-center flex items-center">
	{#if provider}
		<img src={blockies} alt="Avatar" />
		<div class="container">
			<i class="fa-brands fa-ethereum" />
			{account_balance_eth} <br />
		</div>
	{/if}
</div>
