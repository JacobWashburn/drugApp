<script>
	import { goto } from '$app/navigation';
	import numeral from 'numeral';
	import Details from './Details.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';

	let modalStore = getModalStore();
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

	let usedFields = [];
	for (const key of Object.keys(fieldNames)) {
		if (!!data.take[key]) {
			usedFields.push(key);
		}
	}
	let openModal = (question) => {
		modalStore.trigger({
			type: 'component',
			component: { ref: Details, props: { question } }
		});
	};
</script>

<div class="flex flex-col justify-start items-center p-12 h-fit w-full">
	<div class="self-start">
		<i
			class="fas fa-arrow-alt-circle-left text-2xl"
			on:click|stopPropagation={() => goto(`/quizes/${data.quiz._id}`)}
			on:keypress={() => {}}
			role="button"
			tabindex="-1"
		></i>
	</div>
	<div class="h2">{data.quiz.name}</div>
	<div class="flex justify-between items-center min-w-1/2 space-x-12 my-12">
		<div class="flex flex-col">
			<div class="flex space-x-3">
				<div class="text-xl">Started</div>
				<div class="text-xl">{data.take.start || ''}</div>
			</div>
			<div class="flex space-x-3">
				<div class="text-xl">Submitted</div>
				<div class="text-xl">{data.take.submitted}</div>
			</div>
			<div class="flex space-x-3">
				<div class="text-xl">Total Time</div>
				<div class="text-xl">{data.take.time || ''}</div>
			</div>
		</div>
		<div class="flex space-x-3">
			<div class="h1">Total Score</div>
			<div class="h1">{numeral(data.take.score * 0.01).format('0%')}</div>
		</div>
	</div>
	<div class="flex flex-col justify-start items-center w-full space-y-12">
		{#each usedFields as field}
			<table class="table table-fixed">
				<thead>
					<tr>
						<th colspan="2">
							<div class="flex justify-between items-center w-450">
								<div class="h2">{fieldNames[field]}</div>
								<div class="flex space-x-3">
									<div class="text-xl">Score</div>
									<div class="text-xl">
										{numeral(data.take[field].result * 0.01).format('0%')}
									</div>
								</div>
							</div>
						</th>
					</tr>
					<tr>
						<th>Correct</th>
						<th>Wrong</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<div class="flex flex-col">
								{#each data.take[field].correct as cq}
									<div
										class="text-xl cursor-pointer hover:text-blue-500"
										role="none"
										on:click|stopPropagation={() => openModal(cq)}
									>
										{cq.drug}
									</div>
								{/each}
							</div>
						</td>
						<td>
							<div class="flex flex-col space-y-1 cursor-pointer">
								{#each data.take[field].wrong as wq}
									<div
										class="text-xl cursor-pointer hover:text-blue-500"
										role="none"
										on:click|stopPropagation={() => openModal(wq)}
									>
										{wq.drug}
									</div>
								{/each}
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		{/each}
	</div>
</div>
