<script>
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import InputGroup from '../InputGroup.svelte';
</script>

<div class="flex flex-col justify-start items-center">
	<form
		action="?/login"
		method="post"
		use:enhance={({ formData, action, cancel }) => {
			return async ({ result: { data }, update }) => {
				// await update({ reset: false });
				if (data.success === true) {
					window.localStorage.setItem('feathers-jwt', data.accessToken);
					goto('/');
				}
			};
		}}
	>
		<InputGroup>
			<div class="w-100 bg-surface-100">Email</div>
			<input class="" name="email" type="email" />
		</InputGroup>
		<InputGroup>
			<div class="w-100 bg-surface-100">Password</div>
			<input class="" name="password" type="password" />
		</InputGroup>
		<button type="submit">Login</button>
	</form>
</div>
