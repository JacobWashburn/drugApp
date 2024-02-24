<script>
	import { services } from '$lib/feathers/index.js';
	import { goto } from '$app/navigation';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import generateQuiz from '$lib/generateQuiz.js';
	import InputGroup from '../../InputGroup.svelte';
	import StringFilter from '$lib/components/StringFilter.svelte';

	let { Drugs, Quizes } = services;
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
		},
		{
			label: 'Duration',
			field: 'duration'
		},
		{
			label: 'Considerations',
			field: 'notes'
		}
	];
	let all = false;
	let generating = false;
	let name = 'New Quiz';
	let amount = null;
	let selection = [];
	$: quizFields = fields.reduce((acc, curr) => {
		acc[curr.field] = all;
		return acc;
	}, {});
	let generate = () => {
		generating = true;
		let list;
		if (selection.length > 0) {
			list = $Drugs.arr
				.filter((d) => selection.includes(d.name))
				.sort(() => (Math.random > 0.5 ? 1 : -1));
		} else {
			list = $Drugs.arr.sort(() => (Math.random > 0.5 ? 1 : -1)).slice(0, amount);
		}
		generateQuiz(quizFields, list, $Drugs.arr, Quizes, name)
			.then((res) => {
				generating = false;
				goto('/quizes');
			})
			.catch((err) => {
				console.error(err);
				generating = false;
			});
	};
</script>

<div class="flex flex-col justify-center items-center p-12">
	<div class="self-start">
		<i
			class="fas fa-arrow-alt-circle-left text-2xl"
			on:click|stopPropagation={() => goto('/quizes')}
			on:keypress={() => {}}
			role="button"
			tabindex="-1"
		></i>
	</div>
	<InputGroup class="max-w-500 mb-7">
		<div class="bg-surface-400">Quiz Name</div>
		<input bind:value={name} type="text" />
	</InputGroup>
	<div class="flex flex-col justify-center items-center card p-3 space-y-3 mb-7">
		<InputGroup class="max-w-500 ">
			<div class="bg-surface-400">Drugs amount</div>
			<input
				bind:value={amount}
				min="0"
				on:input={() => {
					if (selection.length) {
						selection = [];
					}
				}}
				type="number"
			/>
		</InputGroup>
		<div class="">or</div>
		<div class="">
			<StringFilter
				bind:chips={selection}
				drugs={$Drugs.arr.sort(({ name: a }, { name: b }) => (a === b ? 0 : a < b ? -1 : 1))}
				on:change={(e) => {
					amount = null;
					selection = e.detail;
				}}
			/>
		</div>
	</div>
	<div class="flex items-center space-x-7">
		<div class="flex flex-col">
			<div class="h2">Include fields</div>
			<div class="flex justify-center space-x-3">
				<div class="font-bold">Select All</div>
				<Checkbox bind:checked={all} />
			</div>
		</div>
		<div class="flex flex-col space-y-1">
			{#each fields as f}
				<div class="flex space-x-3">
					<div class="font-bold w-150">{f.label}</div>
					<Checkbox bind:checked={quizFields[f.field]} />
				</div>
			{/each}
		</div>
	</div>
	<div class="mt-12">
		<button class="btn border-white border bg-secondary-400" on:click={generate}
			>Generate New Quiz
		</button>
	</div>
</div>

{#if generating}
	<Spinner />
{/if}
