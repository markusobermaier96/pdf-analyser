<script>
	import FileUpload from '@lib/components/FileUpload.svelte';
	import Payment from '@lib/components/Payment.svelte';
	import '../app.css';

	const navigation = [
		{
			name: 'Home',
			href: '/#'
		},
		{
			name: 'About',
			href: '/#'
		}
	];
</script>

<Payment />
<FileUpload />
<div class="container w-[75vw] mx-auto flex flex-col space-y-4">
	<header class="">
		<div class="flex h-16 border-b border-b-slate-200 py-4">
			<nav-left class="ml-4 flex self-center">
				<ul class="flex space-x-4">
					{#each navigation as item}
						<li>
							<a href={item.href} class="hover:text-slate-600 cursor-pointer">
								{item.name}
							</a>
						</li>
					{/each}
				</ul>
			</nav-left>
			<brand-name
				class="hidden lg:flex text-2xl font-bold font-serif absolute left-1/2 transform -translate-x-1/2"
				>PDF Analyser</brand-name
			>
			<nav-right class="self-center flex justify-end w-full mr-4 space-x-12">
				<label
					for="file-upload"
					class="rounded-lg border p-2 border-gray-300 hover:border-gray-500 self-center"
					>Upload PDF</label
				>
				<label
					for="my-modal-3"
					class="rounded-lg border p-2 border-gray-300 hover:border-gray-500 self-center"
					>Pay with Crypto</label
				>
			</nav-right>
		</div>
	</header>

	<main class="flex w-full flex-1 flex-col overflow-hidden">
		<slot />
	</main>
	<footer class="m-auto p-4 text-gray-400">
		<div>Powered by LangChainAI.</div>
	</footer>
</div>
