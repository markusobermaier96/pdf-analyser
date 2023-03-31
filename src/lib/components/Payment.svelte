<script lang="ts">
	let cryptoType: string;
	let amount: number;
	let walletAddress: string;

	function submitPayment() {
		console.log('check');
	}
</script>

<form on:submit|preventDefault={submitPayment}>
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
	<label>
		Recipient wallet address:
		<input type="text" bind:value={walletAddress} />
	</label>
	<button type="submit">Pay</button>
</form>
