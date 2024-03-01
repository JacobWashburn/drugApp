<script>
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import InputGroup from '../InputGroup.svelte';
	import Register from './Register.svelte';

	let register = false;
</script>

<div class="flex flex-col h-full justify-center items-center">
	{#if !register}
		<form
			class="flex flex-col space-y-2"
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
				<div class="w-100">Email</div>
				<input class="" name="email" type="email" />
			</InputGroup>
			<InputGroup>
				<div class="w-100">Password</div>
				<input class="" name="password" type="password" />
			</InputGroup>
			<div class="flex justify-between w-full">
				<button class="btn border border-white self-center" type="submit">Login</button>
				<div class="cursor-pointer" role="none" on:click|stopPropagation={() => (register = true)}>
					Register
				</div>
			</div>
		</form>
	{:else}
		<Register bind:register />
	{/if}
</div>
