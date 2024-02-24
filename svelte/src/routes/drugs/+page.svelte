<script>
	import { services } from '$lib/feathers/index.js';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import NewDrug from '$lib/modals/NewDrug.svelte';
	import clone from 'lodash.clonedeep';
	import InputGroup from '../InputGroup.svelte';
	import { goto } from '$app/navigation';
	import DeleteDrug from './DeleteDrug.svelte';

	let modalStore = getModalStore();
	let { Drugs } = services;
	let search = '';
</script>

<div class="flex flex-col items-center justify-center p-12">
	{#await Drugs.fetch()}
		<div class="h1">getting data</div>
	{:then data}
		<div class="self-start">
			<i
				class="fas fa-arrow-alt-circle-left text-2xl"
				on:click|stopPropagation={() => goto('/')}
				on:keypress={() => {}}
				role="button"
				tabindex="-1"
			></i>
		</div>
		<div class="">
			<InputGroup>
				<div class="bg-surface-500">Search</div>
				<input type="text" bind:value={search} />
			</InputGroup>
		</div>
		<div class="flex h2 m-7">
			New Drug <span class="ml-7"
				><i
					class="fas fa-circle-plus"
					role="button"
					on:keypress={() => {}}
					tabindex="-1"
					on:click|stopPropagation={() => {
						modalStore.trigger({
							type: 'component',
							component: 'NewDrug'
						});
					}}
				></i></span
			>
		</div>
		<div class="flex flex-col space-y-3">
			{#each $Drugs.arr
				.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
				.sort(({ name: a }, { name: b }) => (a === b ? 0 : a < b ? -1 : 1)) as drug}
				<div
					class="card card-hover cursor-pointer p-3"
					role="none"
					on:click|stopPropagation={() => goto(`/drugs/${drug._id}`)}
				>
					<div class="w-full flex justify-between">
						<i
							class="fas fa-pencil-alt"
							role="none"
							on:click|stopPropagation={() => {
								modalStore.trigger({
									type: 'component',
									component: { ref: NewDrug, props: { newDrug: clone(drug) } }
								});
							}}
						></i>
						<i
							class="fas fa-trash-alt"
							role="none"
							on:click|stopPropagation={() => {
								modalStore.trigger({
									type: 'component',
									component: { ref: DeleteDrug, props: { drug } }
								});
							}}
						></i>
					</div>
					<div class="h2">{drug.name}</div>
				</div>
			{/each}
		</div>
	{/await}
</div>
