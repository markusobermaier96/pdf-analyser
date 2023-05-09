<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { Currency } from '@lib/utils/metamask';
	import { sendTransaction } from '@lib/utils/metamask';
	import toast from 'svelte-french-toast';
	import { Item, get } from '@lib/utils/metamask';
	import type { JsonRpcSigner } from 'ethers';
	import { writable } from 'svelte/store';
	import { selectedDocument } from '@lib/store/globalStore';

	let loading = writable(false);

	const handleSubmit: SubmitFunction = async ({ data, cancel }) => {
		if (
			!(
				data.has('pdf') &&
				data.get('pdf')?.size !== 0 &&
				data.get('pdf')?.type === 'application/pdf'
			)
		) {
			toast.error('Please choose a pdf file.');
			cancel();
			return;
		}

		// confirm metamask transaction before upload
		const estimatedCost: string = await fetch('/costs', {
			method: 'POST',
			body: data
		}).then((res) => {
			return res.json();
		});
		if (!window.confirm(`Estimated cost: ${estimatedCost}$. Proceed?`)) {
			cancel();
			return;
		}

		// TODO: Decide about transaction
		/* try {
			await sendTransaction(Currency.USD, estimatedCost, (await get(Item.Signer)) as JsonRpcSigner);
		} catch (err: any) {
			if (err.code === 4001) {
				toast.error('Transaction denied. Upload aborted.');
			}
			console.log(err.code);
			if (err.code === 'INSUFFICIENT_FUNDS') {
				toast.error('Insufficient balance in your Metamask Wallet');
			}
			cancel();
			return;
		}
 */
		data.append('publicAddress', publicAddress);

		// start loading bar
		loading.set(true);

		return async ({ result, update }) => {
			loading.set(false);
			if (result.type == 'success') {
				if (result.data) {
					selectedDocument.set({
						title: result.data.title,
						index: result.data.hash
					});
				}
				toast.success('Successfully uploaded file');
				document.getElementById('modalClose')?.click();
			} else {
				toast.error('Error occured. Try again');
			}
			update();
		};
	};

	export let publicAddress: string;
</script>

<input type="checkbox" id="file-upload" class="modal-toggle" />
<div class="modal">
	<div class="modal-box relative">
		<form method="POST" use:enhance={handleSubmit} action="?/upload">
			<input name="pdf" type="file" class="file-input file-input-ghost w-full max-w-xs" />
			{#if $loading}
				<i class="fa-solid fa-spinner animate-spin ml-6" />
			{:else}
				<button class="border p-2 ml-2 border-gray-300 bg-blue-400 rounded-lg" type="submit"
					>Upload</button
				>
			{/if}
		</form>
		<label id="modalClose" for="file-upload" class="btn btn-sm btn-circle absolute right-2 top-2"
			>✕</label
		>
	</div>
</div>
