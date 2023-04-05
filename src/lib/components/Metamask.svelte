<script lang="ts">
	import { onMount } from "svelte";
	import { BrowserProvider, ethers, formatEther, type BigNumberish } from 'ethers';

	const network = "test"

	let provider: BrowserProvider;
	let signer;
	let balance: BigNumberish
	let balance_eth: string;

	onMount(async () => {
		provider = new ethers.BrowserProvider(window.ethereum)
		signer = await provider.getSigner();
		balance = await provider.getBalance("ethers.eth")
		balance_eth = formatEther(balance)
	})
	
	let amount: number;
	let walletAddress: string;
	let cryptoType: string;

	async function switchNetwork() {
		try {
			await ethereum?.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: '0xf00' }]
			});
		} catch (switchError: any) {
			// This error code indicates that the chain has not been added to MetaMask.
			if (switchError.code === 4902) {
				try {
					await ethereum?.request({
						method: 'wallet_addEthereumChain',
						params: [
							{
								chainId: '0xf00',
								chainName: network,
								rpcUrls: ['https://127.0.0.1'] //TODO: add rpcUrls
							}
						]
					});
				} catch (addError) {
					// handle "add" error
				}
			}
			// handle other "switch" errors
		}
	}

	function submitPayment() {
		//switchNetwork().catch(err => {console.log(err); return})
		// TODO: all ether related backend stuff goes here
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

<div>
	{balance_eth}
</div>
