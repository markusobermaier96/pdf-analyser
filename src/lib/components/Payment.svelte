<script lang="ts">
	let amount: number;
	let walletAddress: string;
	let cryptoType: string;

	function submitPayment() {
		console.log('chekc');
	}
</script>

<input type="checkbox" id="my-modal-3" class="modal-toggle" />
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
		<label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
	</div>
</div>