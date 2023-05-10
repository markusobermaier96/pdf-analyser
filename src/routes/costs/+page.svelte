<div class="text-xl lg:w-1/2 self-center mt-8 p-5">
	<table class="border-collapse w-full">
		<thead>
			<tr>
				<th class="th">Process</th>
				<th class="th">Price</th>
			</tr>
		</thead>
		<tbody>
			<tr class="tr">
				<td class="td"> Create Embeddings </td>
				<td class="td"> $0.0004 / 1K tokens </td>
			</tr>
			<tr class="tr">
				<td class="td"> Upload to Pinecone </td>
				<td class="td"> $2.67 / day </td>
			</tr>
			<tr class="tr">
				<td class="td"> Using Chatbot </td>
				<td class="td"> $0.002 / 1K tokens </td>
			</tr>
		</tbody>
		<tfoot
			><tr>
				<th
					class="p-3 text-sm bg-gray-100 text-gray-400 border border-gray-300 hidden lg:table-cell"
					colspan="2"
					>1 word = 1.33 tokens
				</th>
			</tr></tfoot
		>
	</table>
</div>

<!-- ------------------------------ -->
<svelte:head>
	<title>Pricing • PDF Analyser</title>
</svelte:head>

<style lang="postcss">
	.th {
		@apply p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell;
	}
	.tr {
		@apply bg-white flex flex-row flex-wrap mb-10;
		@apply lg:mb-0 lg:table-row lg:hover:bg-gray-100;
	}
	.td {
		@apply w-full p-3 text-gray-800 text-center border border-b block relative;
		@apply lg:w-auto lg:table-cell lg:static;
	}
</style>
