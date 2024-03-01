<script>
	import { auth, services } from '$lib/feathers/index.js';
	import { goto } from '$app/navigation';
	import numeral from 'numeral';
	import generateQuiz from '$lib/generateQuiz.js';
	import createTake from '$lib/createTake.js';

	let user = auth.store;
	let { Drugs } = services;
	export let data;
	let fieldNames = {
		class: 'Class',
		mechanism: 'Mechanism',
		indications: 'Indications',
		contraindications: 'Contraindications',
		sideEffects: 'Side Effects',
		interactions: 'Interactions',
		adultDosage: 'Adult Dosage',
		pedDosage: 'Pediatric Dosage',
		duration: 'Duration',
		notes: 'Considerations'
	};
	let usedFields = data.takes
		.filter((t) => t.createdBy === $user.email)
		.reduce((acc, take) => {
			for (const key of Object.keys(fieldNames)) {
				if (!acc[key] && !!take[key]) {
					acc[key] = true;
				}
			}
			return acc;
		}, {});
	for (const field of data.quiz.fields) {
		if (!usedFields[field]) {
			console.log(field);
			usedFields[field] = true;
		}
	}
	console.log($user, data.takes);
	const totalQs =
		data.quiz.fields.length * data.quiz.drugs.filter((drug) => !!$Drugs.key[drug.drugID]).length;
	const take = () => {
		let drugList = data.quiz.drugs.map((d) => $Drugs.key[d.drugID]).filter((d) => !!d);
		const quizFields = Object.keys(fieldNames).reduce((acc, curr) => {
			acc[curr] = data.quiz.fields.includes(curr);
			return acc;
		}, {});
		let quiz = generateQuiz(quizFields, drugList, $Drugs.arr, data.quiz.name);
		quiz._id = data.quiz._id;
		let drugs = Object.keys(quiz)
			.filter((k) => !['name', '_id', 'fields'].includes(k))
			.map((key) => quiz[key]);
		console.log(quiz);
		createTake(drugs, quiz, fieldNames).then((res) => {
			goto(`/takes/${res._id}`);
		});
	};
</script>

<div class="w-full flex flex-col justify-start items-center p-12">
	<div class="self-start w-full flex justify-between">
		<i
			class="fas fa-arrow-alt-circle-left text-2xl"
			on:click|stopPropagation={() => goto('/quizes')}
			on:keypress={() => {}}
			role="button"
			tabindex="-1"
		></i>
		{#if data.quiz.createdBy === $user.email}
			<i
				class="fas fa-pencil-alt text-2xl"
				on:click|stopPropagation={() => goto(`/quizes/${data.quiz._id}/edit`)}
				on:keypress={() => {}}
				role="button"
				tabindex="-1"
			></i>
		{/if}
	</div>
	<div class="h2">{data.quiz.name}</div>
	<div class="text-2xl mt-3">{totalQs} Questions</div>
	<div class="flex space-x-12 mt-3">
		<button class="text-xl btn border border-white" on:click|stopPropagation={take}
			>Take Quiz
		</button>
		<button
			class="text-xl btn border border-white"
			on:click|stopPropagation={() => {
				goto(`/quizes/${data.quiz._id}/review`);
			}}
			>Start Review
		</button>
	</div>

	<div class="flex flex-wrap space-x-12 my-3 max-h-250 overflow-y-auto">
		{#each data.quiz.drugs.filter((drug) => !!$Drugs.key[drug.drugID]) as d}
			<div class="h3 mb-7">{d.name}</div>
		{/each}
	</div>
	<div class="table-container flex-1">
		<table class="table">
			<thead>
				<tr>
					<th> Submitted</th>
					<th> Time</th>
					<th> Score</th>
					{#each Object.keys(usedFields) as f}
						<th>
							{fieldNames[f]}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each data.takes.filter((t) => t.createdBy === $user.email) as t}
					<tr
						class:cursor-pointer={!!t.submitted}
						class=""
						on:click|stopPropagation={() => {
							if (!!t.submitted) {
								goto(`/quizes/${data.quiz._id}/${t._id}`);
							} else goto(`/takes/${t._id}`);
						}}
					>
						{#if !!t.submitted}
							<td>
								{t.submitted}
							</td>
							<td>
								{t.time}
							</td>
						{:else}
							<td colspan="2" class="text-red-500"> Not Submitted</td>
						{/if}
						<td>
							{numeral(t?.score * 0.01).format('0%')}
						</td>
						{#each Object.keys(usedFields) as f}
							<td>
								{t[f] ? numeral(t[f]?.result * 0.01).format('0%') : ''}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.table thead th {
		inset: 0;
		position: sticky;
	}
</style>
