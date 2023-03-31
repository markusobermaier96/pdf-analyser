<script lang="ts">
	let amount: number;
	let walletAddress: string;
	let cryptoType: string;

	function submitPayment() {
        console.log("chekc")
    }
</script>

<input type="checkbox" id="my-modal-3" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative flex flex-col justify-center items-center space-y-8">
    <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
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
	<input hidden type="text" bind:value={walletAddress} />
	<button type="submit">Pay</button>
  </div>
</div>

<!-- <form on:submit|preventDefault={submitPayment}>
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
</form> -->
