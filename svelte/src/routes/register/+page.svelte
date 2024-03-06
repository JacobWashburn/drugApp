<script>
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import InputGroup from '../InputGroup.svelte';

	let errorMessage = null;
</script>

<div class="flex flex-col h-full justify-center items-center">
	<form
		action="?/register"
		class="flex flex-col space-y-2"
		method="post"
		use:enhance={({ formData, action, cancel }) => {
			return async ({ result: { data }, update }) => {
				// await update({ reset: false });
				console.log(data);
				if (data.success === true) {
					if (errorMessage) {
						errorMessage = null;
					}
					window.localStorage.setItem('feathers-jwt', data.accessToken);
					goto('/');
				} else {
					if (data.error.keyPattern?.username) {
						errorMessage = 'Username in use';
					} else if (data.error.keyPattern?.email) {
						errorMessage = 'Email already registered';
					} else errorMessage = 'There was a problem signing you up.';
				}
			};
		}}
	>
		<InputGroup>
			<div class="w-100">Username</div>
			<input class="" name="username" required type="text" />
		</InputGroup>
		<InputGroup>
			<div class="w-100">Email</div>
			<input class="" name="email" required type="email" />
		</InputGroup>
		<InputGroup>
			<div class="w-100">Password</div>
			<input class="" name="password" required type="password" />
		</InputGroup>
		{#if errorMessage}
			<div class="text-2xl">{errorMessage}</div>
		{/if}
		<div class="flex justify-between w-full">
			<button class="btn border border-white self-center" type="submit">Register</button>
			<div class="cursor-pointer" on:click|stopPropagation={() => goto('/login')} role="none">
				Login
			</div>
		</div>
	</form>
</div>
