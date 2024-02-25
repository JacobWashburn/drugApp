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

	$: if (browser && $page.route) {
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
	load();
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<!--Modals initilization-->
<Modal components={modals} regionBackdrop="!bg-gray-300/60" />

<!--Toasts initilization-->
<Toast position="bl" />

<div class="w-full h-full flex flex-col justify-center items-center overflow-y-auto">
	<slot />
</div>
