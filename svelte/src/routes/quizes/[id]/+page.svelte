<script>
	import { services } from '$lib/feathers/index.js';
	import { goto } from '$app/navigation';
	import numeral from 'numeral';
	import generateQuiz from '$lib/generateQuiz.js';
	import createTake from '$lib/createTake.js';

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
	const take = () => {
		let drugList = data.quiz.drugs.map((d) => $Drugs.key[d.drugID]);
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

<div class="w-full flex h-full flex-col justify-center items-center p-12">
	<div class="self-start">
		<i
			class="fas fa-arrow-alt-circle-left text-2xl"
			on:click|stopPropagation={() => goto('/quizes')}
			on:keypress={() => {}}
			role="button"
			tabindex="-1"
		></i>
	</div>
	<div class="h2">{data.quiz.name}</div>
	<div class="flex space-x-12">
		<button class="text-xl btn border border-white mt-12" on:click|stopPropagation={take}
			>Take Quiz
		</button>
		<button
			class="text-xl btn border border-white mt-12"
			on:click|stopPropagation={() => {
				goto(`/quizes/${data.quiz._id}/review`);
			}}
			>Start Review
		</button>
	</div>

	<div class="flex flex-wrap space-x-12 mt-12">
		{#each data.quiz.drugs as d}
			<div class="h3 mb-7">{d.name}</div>
		{/each}
	</div>
	<div class="table-container flex-1 overflow-y-auto">
		<table class="table table-interactive">
			<thead>
				<tr>
					<th class="min-w-250">Submitted</th>
					<th class="min-w-150">Time</th>
					<th class="min-w-150">Score</th>
					{#each data.quiz.fields as f}
						<th class="min-w-150">{fieldNames[f]}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each data.takes as t}
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
							<td>{t.submitted}</td>
							<td>{t.time}</td>
						{:else}
							<td colspan="2" class="text-red-500">Not Submitted</td>
						{/if}
						<td>{numeral(t?.score * 0.01).format('0%')}</td>
						{#each data.quiz.fields as f}
							<td>{numeral(t[f]?.result * 0.01).format('0%')}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
