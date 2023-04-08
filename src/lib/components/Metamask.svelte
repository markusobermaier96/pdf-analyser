<script lang="ts">
	import { onMount } from "svelte";
	import { BrowserProvider, ethers, formatEther, type BigNumberish, EnsResolver, JsonRpcSigner } from 'ethers';

	
	let provider: BrowserProvider;
	let signer: JsonRpcSigner;
	let network = "testtest";

	let resolver: EnsResolver | null;
	let account_addr: string;
	let account_balance_eth: bigint
	let blockies: string | null | undefined;

	onMount(async () => {
		provider = new ethers.BrowserProvider(window.ethereum);
		await provider.send("eth_requestAccounts", []);
		signer = await provider.getSigner();

		resolver = await provider.getResolver("markus.eth");
		//console.log(resolver?.getAddress())
		//blockies = await provider.getAvatar("0x093A8Ff723691ecA35b47167E4878786db9D7337")
		var address = await provider.resolveName('alice.eth');
		console.log(address)
		account_balance_eth = await provider.getBalance("ethers.eth");
	})
	
	let amount: number;
	let walletAddress: string;
	let cryptoType: string;

	async function switchNetwork() {
		provider = new ethers.BrowserProvider(window.ethereum, "any")
		provider.on("network", (newNetwork, oldNetwork) => {
        // When a Provider makes its initial connection, it emits a "network"
        // event with a null oldNetwork along with the newNetwork. So, if the
        // oldNetwork exists, it represents a changing network
        if (oldNetwork) {
            window.location.reload();
        }
    });
	}

	function makeTransaction() {
		
	}
</script>

<!-- <input type="checkbox" id="pay" class="modal-toggle" />
<div class="modal">
	<div class="modal-box relative flex flex-col justify-center items-center">
		<form class="flex flex-col space-y-8" on:submit|preventDefault={() => submitPayment()}>
			<label>
				Cryptocurrency type:
				<select bind:value={cryptoType}>
					<option value="BTC">Bitcoin</option>
					<option value="ETH">Ethereum</option>
					<option value="LTC">Litecoin</option>
				</select>
			</label>
			<label>
				Amount:
				<input type="number" step="0.0001" bind:value={amount} />
			</label>
			<button type="submit">Pay</button>
		</form>
		<label for="pay" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
	</div>
</div> -->

<div class="self-center flex items-center">
	{#if provider}
		<img src={blockies} alt="Avatar" />
		<div class="container">
			<i class="fa-brands fa-ethereum"></i>
			{account_balance_eth} <br>
		</div>
		
	{/if}
</div>
