<script>
	import { services } from '$lib/feathers';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import InputGroup from '../../routes/InputGroup.svelte';
	import DrugItem from '$lib/components/DrugItem.svelte';

	let modalStore = getModalStore();

	let { Drugs } = services;
	export let newDrug = {
		name: '',
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
	};
	let fields = [
		{
			label: 'Class',
			field: 'class'
		},
		{
			label: 'Mechanism',
			field: 'mechanism'
		},
		{
			label: 'Indications',
			field: 'indications'
		},
		{
			label: 'Contraindications',
			field: 'contraindications'
		},
		{
			label: 'Side Effects',
			field: 'sideEffects'
		},
		{
			label: 'Interactions',
			field: 'interactions'
		},
		{
			label: 'Adult Dosage',
			field: 'adultDosage'
		},
		{
			label: 'Pediatric Dosage',
			field: 'pedDosage'
		}
	];
	const durationFields = [
		{
			label: 'Onset',
			field: 'onset'
		},
		{
			label: 'Peak',
			field: 'peak'
		},
		{
			label: 'Duration',
			field: 'duration'
		}
	];

	const newItem = (field) => (newDrug[field] = [...newDrug[field], '']);
	const removeItem = (field, i) =>
		(newDrug[field] = newDrug[field].filter((item, idx) => idx !== i));
	const newDuration = () =>
		(newDrug.duration = [...newDrug.duration, { onset: '', peak: '', duration: '' }]);
	const create = () => {
		Drugs.create(newDrug).then((res) => {
			modalStore.close();
		});
	};
	const save = () => {
		Drugs.patch(newDrug._id, newDrug).then((res) => {
			modalStore.close();
		});
	};
</script>

<div
	class="flex flex-col w-full h-[100vh] justify-start items-center p-12 space-y-7 bg-surface-500"
>
	<div class="flex w-full flex-col justify-start items-start h-[90%] space-y-12 overflow-y-auto">
		<InputGroup>
			<div class="bg-surface-400">Name</div>
			<input bind:value={newDrug.name} type="text" />
		</InputGroup>
		{#each fields as f}
			<DrugItem
				bind:values={newDrug[f.field]}
				label={f.label}
				field={f.field}
				{newItem}
				{removeItem}
			/>
		{/each}
		<div class="flex w-fit">
			<div class="h3">
				Duration
				<span
					><i
						class="fas fa-circle-plus"
						on:click|stopPropagation={newDuration}
						on:keypress={() => {}}
						role="button"
						tabindex="-1"
					></i></span
				>
			</div>
			<div class="flex flex-col space-y-7 w-fit">
				{#each newDrug.duration as d, i}
					<div class="flex flex-col">
						{#each durationFields as f}
							<InputGroup>
								<div class="w-100">
									{f.label}
								</div>
								<textarea class="bg-transparent" bind:value={d[f.field]} rows="2" cols="100" />
								<div class="flex justify-start">
									<i
										class="fas fa-circle-minus text-red-500 text-xl"
										on:click|stopPropagation={() => removeItem('duration', i)}
										on:keypress={() => {}}
										role="button"
										tabindex="-1"
									></i>
								</div>
							</InputGroup>
						{/each}
					</div>
				{/each}
			</div>
		</div>
		<div class="flex w-fit">
			<InputGroup>
				<div class="bg-surface-400">Considerations</div>
				<textarea bind:value={newDrug.notes} class="bg-transparent" cols="100" rows="6" />
			</InputGroup>
		</div>
	</div>
	<div class="flex space-x-7">
		<button class="btn border border-black bg-surface-400" on:click={modalStore.close}
			>Cancel
		</button>
		<button
			class="btn border border-black bg-surface-400"
			class:hidden={!!newDrug._id}
			on:click={create}
			>Create
		</button>
		<button
			class="btn border border-black bg-surface-400"
			class:hidden={!newDrug._id}
			on:click={save}
			>Save
		</button>
	</div>
</div>
