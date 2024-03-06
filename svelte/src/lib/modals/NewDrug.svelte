<script>
	import { services } from '$lib/feathers';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import InputGroup from '../../routes/InputGroup.svelte';
	import DrugItem from '$lib/components/DrugItem.svelte';

	const toastStore = getToastStore();

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
	let timeout = null;

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
	let onChange = () => {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => {
			Drugs.patch(newDrug._id, newDrug).then(() => {
				toastStore.trigger({
					message: `Saved!`,
					timeout: 2000
				});
			});
		}, 1000);
	};
	const newItem = (field) => {
		newDrug[field] = [...newDrug[field], ''];
		onChange();
	};
	const removeItem = (field, i) => {
		newDrug[field] = newDrug[field].filter((item, idx) => idx !== i);
		onChange();
	};
	const newDuration = () => {
		newDrug.duration = [...newDrug.duration, { onset: '', peak: '', duration: '' }];
		onChange();
	};
</script>

<div class="flex flex-col h-[100vh] justify-start items-center p-12 bg-surface-500">
	<div class="flex flex-col justify-start items-start max-h-full overflow-y-scroll">
		<InputGroup>
			<div class="bg-surface-400">Name</div>
			<input bind:value={newDrug.name} on:input={onChange} type="text" />
		</InputGroup>
		{#each fields as f}
			<DrugItem
				bind:values={newDrug[f.field]}
				label={f.label}
				field={f.field}
				{newItem}
				{removeItem}
				on:change={onChange}
			/>
		{/each}
		<div class="flex w-fit mb-7">
			<div class="h3">Duration</div>
			<div class="flex flex-col space-y-7 w-fit">
				<div>
					<i
						class="fas fa-circle-plus text-4xl"
						on:click|stopPropagation={newDuration}
						on:keypress={() => {}}
						role="button"
						tabindex="-1"
					></i>
				</div>
				{#each newDrug.duration as d, i}
					<div class="flex flex-col">
						{#each durationFields as f}
							<InputGroup>
								<div class="w-100">
									{f.label}
								</div>
								<textarea
									class="bg-transparent"
									on:input={onChange}
									bind:value={d[f.field]}
									rows="2"
									cols="100"
								/>
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
				<textarea
					bind:value={newDrug.notes}
					class="bg-transparent"
					cols="100"
					on:input={onChange}
					rows="6"
				/>
			</InputGroup>
		</div>
	</div>
	<div class="flex space-x-7">
		<button class="btn border border-black bg-surface-400" on:click={modalStore.close}
			>Close
		</button>
	</div>
</div>
