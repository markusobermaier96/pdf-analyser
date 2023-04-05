<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import toast from 'svelte-french-toast';

	const handleSubmit: SubmitFunction = async ({ form, data, action, cancel, submitter }) => {
		if (!(data.has('pdf') && data.get('pdf')?.size != 0)) {
			toast.error('Please choose a pdf file.');
			cancel();
		} else if (data.get('pdf')?.type != 'application/pdf') {
			toast.error('This is not a pdf file');
			cancel();
		}
		return async ({ result, update }) => {
			if (result.type == 'success') {
				toast.success('Successfully uploaded file');
				document.getElementById('modalClose')?.click();
			} else {
				toast.error('Error occured. Try again');
			}
			update();
		};
	};
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