<script>
	import { services } from '$lib/feathers/index.js';
	import { getModalStore, Paginator } from '@skeletonlabs/skeleton';
	import NewDrug from '$lib/modals/NewDrug.svelte';
	import clone from 'lodash.clonedeep';
	import InputGroup from '../InputGroup.svelte';
	import { goto, replaceState } from '$app/navigation';
	import DeleteDrug from './DeleteDrug.svelte';
	import { page } from '$app/stores';

	$: console.log($page);
	let modalStore = getModalStore();
	let { Drugs } = services;
	let search = $page.state.search ?? '';
	let alphabetSearch = $page.state.alphabetSearch ?? null;
	let settings = $page.state.settings ?? {
		page: 0,
		limit: 5,
		size: $Drugs.arr.filter((d) => {
			if (alphabetSearch) {
				return d.name.substring(0, 1).toLowerCase() === alphabetSearch;
			} else {
				return d.name.toLowerCase().includes(search.toLowerCase());
			}
		}).length,
		amounts: [5, 10, 25]
	};
	$: settings.size = $Drugs.arr.filter((d) => {
		if (alphabetSearch) {
			return d.name.substring(0, 1).toLowerCase() === alphabetSearch;
		} else {
			return d.name.toLowerCase().includes(search.toLowerCase());
		}
	}).length;
	$: paginatedRows = $Drugs.arr
		.filter((d) => {
			if (alphabetSearch) {
				return d.name.substring(0, 1).toLowerCase() === alphabetSearch;
			} else {
				return d.name.toLowerCase().includes(search.toLowerCase());
			}
		})
		.sort(({ name: a }, { name: b }) => (a === b ? 0 : a < b ? -1 : 1))
		.slice(settings.page * settings.limit, settings.page * settings.limit + settings.limit);
	$: setState(settings);
	const setState = (something) => {
		replaceState('', { search, alphabetSearch, settings });
	};
	// prettier-ignore
	let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
</script>

<div class="flex h-[100vh] w-full flex-col items-center justify-center relative p-12">
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
		<div class="flex h2">
			New Drug <span class="ml-7"
				><i
					class="fas fa-circle-plus"
					role="button"
					on:keypress={() => {}}
					tabindex="-1"
					on:click|stopPropagation={() => {
						Drugs.create({
							name: 'New Drug',
							class: [],
							mechanism: [],
							indications: [],
							contraindications: [],
							sideEffects: [],
							interactions: [],
							adultDosage: [],
							pedDosage: [],
							duration: [],
							notes: ''
						}).then((res) => {
							modalStore.trigger({
								type: 'component',
								component: { ref: NewDrug, props: { newDrug: clone(res) } }
							});
						});
					}}
				></i></span
			>
		</div>
		<div class="m-7">
			<InputGroup>
				<div class="bg-surface-500">Search</div>
				<input
					type="text"
					on:input={() => {
						alphabetSearch = null;
						settings.page = 0;
						setState();
					}}
					bind:value={search}
				/>
			</InputGroup>
		</div>
		<div class="flex mb-3 text-xl items-end">
			<div
				class="hover:text-blue-500 cursor-pointer mr-3"
				role="none"
				on:click|stopPropagation={() => {
					settings.page = 0;
					alphabetSearch = null;
					search = '';
				}}
			>
				All
			</div>
			{#each alphabet as char}
				<div
					class=" text-center ml-2 hover:text-blue-500 cursor-pointer"
					class:text-blue-500={alphabetSearch === char}
					class:text-4xl={alphabetSearch === char}
					role="none"
					on:click|stopPropagation={() => {
						settings.page = 0;
						alphabetSearch = char;
						search = '';
						setState();
					}}
				>
					{char.toUpperCase()}
				</div>
			{/each}
		</div>
		<Paginator bind:settings showFirstLastButtons={false} />
		<div class="flex-1 min-w-600 p-3 space-y-3 mt-3 scroll-px-4 flex flex-col overflow-y-auto">
			{#each paginatedRows as drug}
				<div
					class=" shrink-0 card space-y-3 card-hover cursor-pointer p-3"
					role="none"
					on:click|stopPropagation={() => goto(`/drugs/${drug._id}`, { state: $page.state })}
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
					<div class="text-2xl">{drug.name}</div>
				</div>
			{/each}
		</div>
	{/await}
</div>
