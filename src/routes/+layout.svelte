<script>
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

<div class="container mx-auto flex flex-col space-y-4">
	<header class="sticky top-0 z-40 bg-white">
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
			<nav-right class="self-center flex justify-end w-full mr-4">
				<div class="">PDF</div>
			</nav-right>
		</div>
	</header>

	<main class="flex w-full flex-1 flex-col overflow-hidden">
		<slot />
	</main>
	<footer class="m-auto p-4 text-gray-400">
		<a href="https://twitter.com/mayowaoshin"> Powered by LangChainAI. </a>
	</footer>
</div>
