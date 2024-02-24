<script>
	import { services } from '$lib/feathers/index.js';
	import { getModalStore } from '@skeletonlabs/skeleton';

	let { Drugs } = services;
	let modalStore = getModalStore();
	export let drug;
	let confirm;
	$: confirmed = confirm === 'CONFIRM';
</script>

<div class="flex flex-col justify-center items-center w-full space-y-3 p-12 card">
	<div class="text-2xl">You are about to delete {drug.name}.</div>
	<div class="text-2xl">This action is not reversible.</div>
	<div class="">Enter <span class="font-bold">CONFIRM</span> below to proceed.</div>
	<input bind:value={confirm} class="input w-250" type="text" />
	<div class="flex space-x-12">
		<button class="btn border border-white" on:click|stopPropagation={modalStore.close}
			>Cancel
		</button>
		<button
			class="btn border border-white"
			class:bg-red-600={confirmed}
			disabled={!confirmed}
			on:click|stopPropagation={() => {
				Drugs.remove(drug._id).then(() => {
					modalStore.close();
				});
			}}
			>Delete
		</button>
	</div>
</div>
