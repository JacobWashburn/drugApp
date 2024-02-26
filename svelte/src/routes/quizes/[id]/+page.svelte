<script>
	import { goto } from '$app/navigation';
	import numeral from 'numeral';
	import createTake from '$lib/createTake.js';

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
	let drugs = Object.keys(data.quiz)
		.filter((k) => !['name', '_id', 'fields'].includes(k))
		.map((key) => data.quiz[key]);

	const take = () => {
		createTake(drugs, data.quiz, fieldNames).then((res) => {
			goto(`/takes/${res._id}`);
		});
	};
</script>

<div class="w-full flex flex-col justify-center items-center p-12">
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
		{#each drugs as d}
			<div class="h3 mb-7">{d.name}</div>
		{/each}
	</div>
	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Submitted</th>
					<th>Time</th>
					{#each data.quiz.fields as f}
						<th>{fieldNames[f]}</th>
					{/each}
					<th>Score</th>
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
							}
						}}
					>
						{#if !!t.submitted}
							<td>{t.submitted}</td>
							<td>{t.time || ''}</td>
						{:else}
							<td colspan="2" class="text-red-500"
								>Not Submitted <span
									class="ml-7 text-white hover:text-blue-500 cursor-pointer"
									role="none"
									on:click|stopPropagation={() => {
										goto(`/takes/${t._id}`);
									}}>Retake</span
								>
							</td>
						{/if}
						{#each data.quiz.fields as f}
							<td>{numeral(t[f]?.result * 0.01).format('0%')}</td>
						{/each}
						<td>{numeral(t?.score * 0.01).format('0%')}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
