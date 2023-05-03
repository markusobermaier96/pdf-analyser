<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { selectedIndex } from '@lib/store/userStore';
	import { sendTransaction } from '@lib/utils/metamask';
	import toast from 'svelte-french-toast';

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
		data.append('publicAddress', publicAddress);
		// confirm metamask transaction before upload
		/* await sendTransaction()
			.then((val) => console.log(val))
			.catch((err) => {
				if (err.code === 4001) {
					toast.error('Transaction denied. Abort upload.');
				}

				cancel();
				return;
			}); */

		/* await confirmPayment()
			.then(async (_) => {
				
			})
			.catch((err) => {
				toast.error(err);
				cancel();
				return;
			}); */

		return async ({ result, update }) => {
			if (result.type == 'success') {
				if (result.data) {
					selectedIndex.set(result.data.hash);
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
			<button class="border p-2 border-gray-300 bg-blue-400 rounded-lg" type="submit">Upload</button
			>
		</form>
		<label id="modalClose" for="file-upload" class="btn btn-sm btn-circle absolute right-2 top-2"
			>✕</label
		>
	</div>
</div>
