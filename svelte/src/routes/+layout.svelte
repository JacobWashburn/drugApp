<script>
	import '../app.postcss';
	import '@fortawesome/fontawesome-free/css/all.css';
	import { auth, load } from '$lib/feathers/index.js';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import modals from '$lib/modals';
	// Floating UI for Popups
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { initializeStores, Modal, storePopup, Toast } from '@skeletonlabs/skeleton';
	import Spinner from '$lib/components/Spinner.svelte';

	let user = auth.store;
	$: if (browser && $page.route && !['/login', '/register'].includes($page.route.id)) {
		auth
			.reAuthenticate()
			.then((res) => {
				console.log('auth', res);
			})
			.catch((err) => {
				console.log('auth error', err);
			});
	}

	initializeStores();

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<!--Modals initilization-->
<Modal components={modals} regionBackdrop="!bg-gray-300/60" />

<!--Toasts initilization-->
<Toast max={1} position="bl" zIndex="z-[9999]" />

<div class="w-full relative h-[100vh] flex flex-col justify-start items-center overflow-y-auto">
	{#await load()}
		<Spinner />
	{:then data}
		{#if $user?.email}
			<div class="flex justify-center w-full absolute top-0 left-0">
				<div class="text-2xl">Welcome {$user.username}</div>
			</div>
		{/if}
		<slot />
	{:catch err}
		{err.message}
	{/await}
</div>
