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

<div class="mx-auto flex flex-col space-y-4">
	<header class="container sticky top-0 z-40 bg-white">
		<div class="flex h-16 border-b border-b-slate-200 py-4 bg-gray-200">
			<nav-left class="ml-4 pl-6">
				<ul class="flex space-x-2">
					{#each navigation as item}
						<li>
							<a href={item.href} class="hover:text-slate-600 cursor-pointer">
								{item.name}
							</a>
						</li>
					{/each}
				</ul>
			</nav-left>
			<nav-right>
				<div class="absolute right-10">PDF</div>
			</nav-right>
		</div>
	</header>

	<main class="flex w-full flex-1 flex-col overflow-hidden">
		<slot />
	</main>
</div>
