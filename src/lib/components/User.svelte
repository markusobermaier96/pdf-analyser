<script>
	import { enhance } from '$app/forms';
	import { userToken } from '@lib/store/userStore';
</script>

<div class="self-center">
	<form
		action="/auth?/logout"
		method="POST"
		use:enhance={async (event) => {
			userToken.set('');
		}}
	>
		<button class="btn btn-square btn-info">
			<i class="fa-solid fa-right-to-bracket" />
		</button>
	</form>
</div>
