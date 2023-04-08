<script lang="ts">
	import Youtube from "svelte-youtube-embed";
</script>

<div class="text-xl w-1/2 self-center mt-8 p-5">
	<Youtube id="YVgfHZMFFFQ"></Youtube>
	<div class="my-6"></div>
	<ul class="list-style-disc space-y-6 outer">
		<li>
			Upload a PDF file by clicking the "Upload" button and selecting the PDF from your local disk.
		</li>
		<li>
			Choose an option:
			<ul class="list-style-disc inner font-bold">
				<li>free (less optimized model)</li>
				<li>payed (Powered by OpenAi)</li>
			</ul>
		</li>
		<li>
			Once you've selected your chatbot model, you can start interacting with it by asking questions
			about the content of your PDF file. The chatbot will analyze the text and provide you with
			helpful answers.
		</li>
		<li>
			If you need to change the chatbot model you selected, you can do so at any time by clicking
			the "Change Model" button.
		</li>
	</ul>
</div>

<style lang="postcss">
	.outer {
		@apply border border-black rounded-lg shadow-lg p-5;
	}

	.outer > li {
		@apply border-b pb-7;
	}

	.inner {
		@apply text-center;
	}
</style>
