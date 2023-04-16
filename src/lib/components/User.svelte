<script>
	import { userToken } from '@lib/store/globalStore';
</script>

<div class="self-center">
	<button class="btn btn-square btn-info" on:click={() => userToken.set('')}>
		<i class="fa-solid fa-right-to-bracket" />
	</button>
</div>
