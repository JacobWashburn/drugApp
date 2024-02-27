<script>
	import { services } from '$lib/feathers/index.js';
	import { goto } from '$app/navigation';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import InputGroup from '../../../InputGroup.svelte';

	export let data;
	let quiz = data.quiz;
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
	let all = quiz.fields.length === fields.length;
	$: quizFields = fields.reduce((acc, curr) => {
		acc[curr.field] = quiz.fields.includes(curr.field);
		return acc;
	}, {});
	let timeout;
	let patchQuiz = (something) => {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => {
			console.log('patching', quiz);
			Quizes.patch(quiz._id, quiz);
		}, 1000);
	};
	$: patchQuiz(quiz);
</script>

<div class="flex flex-col justify-center w-full items-center p-12">
	<div class="self-start">
		<i
			class="fas fa-arrow-alt-circle-left text-2xl"
			on:click|stopPropagation={() => goto(`/quizes/${quiz._id}`)}
			on:keypress={() => {}}
			role="button"
			tabindex="-1"
		></i>
	</div>
	<InputGroup class="max-w-500 mb-7">
		<div class="bg-surface-400">Quiz Name</div>
		<input bind:value={quiz.name} type="text" />
	</InputGroup>
	<div class="flex items-center space-x-7">
		<div class="flex flex-col">
			<div class="h2">Include fields</div>
			<div class="flex justify-center space-x-3">
				<div class="font-bold">Select All</div>
				<Checkbox
					bind:checked={all}
					on:change={({ detail }) => {
						quiz.fields = detail ? fields.map((f) => f.field) : [];
					}}
				/>
			</div>
		</div>
		<div class="flex flex-col space-y-1">
			{#each fields as f}
				<div class="flex space-x-3">
					<div class="font-bold w-150">{f.label}</div>
					<Checkbox
						checked={quizFields[f.field]}
						on:change={({ detail }) => {
							quiz.fields = detail
								? [...quiz.fields.filter((fd) => fd !== f.field), f.field]
								: quiz.fields.filter((field) => field !== f.field);
						}}
					/>
				</div>
			{/each}
		</div>
	</div>
</div>
