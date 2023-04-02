<script lang="ts">
	const connectToMetamask = () => {
		console.log('connect');
		//ethereum.request({ method: 'eth_requestAccounts' });
	};
</script>

<input type="checkbox" id="wallet" class="modal-toggle" />
<div class="modal">
	<div class="modal-box relative flex flex-col justify-center items-center">
		<form class="flex flex-col space-y-8" on:submit|preventDefault={() => connectToMetamask()}>
			<label for="network">Network:</label>
			<select class="select select-primary" id="network" name="network">
				<option value="mainnet">Mainnet</option>
				<option value="ropsten">Ropsten</option>
				<option value="rinkeby">Rinkeby</option>
				<option value="goerli">Goerli</option>
				<option value="kovan">Kovan</option>
			</select>

			<br />

			<label for="account">Account:</label>
			<input class="input-primary input" type="text" id="account" name="account" readonly />

			<br />

			<button class="btn" type="submit">Connect</button>
		</form>
		<label for="wallet" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
	</div>
</div>
