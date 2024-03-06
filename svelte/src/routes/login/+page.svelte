<script>
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import InputGroup from '../InputGroup.svelte';

	let errorMessage;
</script>

<div class="flex flex-col h-full justify-center items-center">
	<form
		action="?/login"
		class="flex flex-col space-y-2"
		method="post"
		use:enhance={({ formData, action, cancel }) => {
			return async ({ result: { data }, update }) => {
				//await update({ reset: false });
				if (data.success === true) {
					if (errorMessage) {
						errorMessage = null;
					}
					window.localStorage.setItem('feathers-jwt', data.accessToken);
					goto('/');
				} else {
					errorMessage = 'Email/password combination invalid';
				}
			};
		}}
	>
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
			<button class="btn border border-white self-center" type="submit">Login</button>
			<div class="cursor-pointer" on:click|stopPropagation={() => goto('/register')} role="none">
				Register
			</div>
		</div>
	</form>
</div>
