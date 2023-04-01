<script lang="ts">
	import { enhance, type SubmitFunction } from "$app/forms";

	const handleSubmit: SubmitFunction = async ({ form, data, action, cancel, submitter }) => {
        return async ({ result, update }) => {
    };
    }
</script>

<input type="checkbox" id="file-upload" class="modal-toggle" />
<div class="modal">
	<div class="modal-box relative flex flex-col justify-center items-center">
		<form use:enhance={handleSubmit} action="?/upload">
            <input type="file" class="file-input file-input-ghost w-full max-w-xs" />
            <button class="border p-2 border-gray-300 bg-blue-400 rounded-lg" type="submit">Upload</button>
        </form>
		<label for="file-upload" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
	</div>
</div>
