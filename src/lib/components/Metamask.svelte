<script lang="ts">
	import { onMount } from 'svelte';
	import type { ethers } from 'ethers';
	import { connect } from '@lib/utils/metamask';

	let provider: ethers.BrowserProvider;
	let signer: ethers.JsonRpcSigner;

	let account: string;
	let account_balance_eth: string;
	let blockies: string | null | undefined;

	onMount(async () => {
		try {
			const {
				provider: prov,
				signer: sig,
				account: acc,
				account_balance_eth: bal
			} = await connect();
			provider = prov;
			signer = sig;
			account = acc;
			account_balance_eth = bal;
		} catch (error) {
			console.error(error);
		}
	});
</script>

<div class="self-center flex items-center">
	{#if account}
		<img src={blockies} alt="Avatar" />
		<div class="container">
			<i class="fa-brands fa-ethereum" />
			{account_balance_eth} <br />
		</div>
	{/if}
</div>
