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
  <div class="modal-box relative">
    <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <h3 class="text-lg font-bold">Congratulations random Internet user!</h3>
    <p class="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
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
