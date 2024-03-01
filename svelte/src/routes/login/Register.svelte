<script>
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import InputGroup from '../InputGroup.svelte';

	export let register;
	let errorMessage = null;
</script>

<div class="flex flex-col justify-start items-center">
	<form
		action="?/register"
		class="flex flex-col space-y-2"
		method="post"
		use:enhance={({ formData, action, cancel }) => {
			return async ({ result: { data }, update }) => {
				// await update({ reset: false });
				if (data.success === true) {
					if (errorMessage) {
						errorMessage = null;
					}
					window.localStorage.setItem('feathers-jwt', data.accessToken);
					goto('/');
				} else {
					errorMessage = 'Email already registered';
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
			<button class="btn border border-white self-center" type="submit">Register</button>
			<div class="cursor-pointer" on:click|stopPropagation={() => (register = false)} role="none">
				Login
			</div>
		</div>
	</form>
</div>
