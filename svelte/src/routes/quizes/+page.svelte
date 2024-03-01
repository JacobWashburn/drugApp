<script>
	import { auth, services } from '$lib/feathers/index.js';
	import { goto } from '$app/navigation';

	let user = auth.store;

	let { Quizes, Takes, Users } = services;
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
</script>

<div class="flex flex-col justify-start items-center w-full h-full p-12">
	<div class="self-start">
		<i
			class="fas fa-arrow-alt-circle-left text-2xl"
			on:click|stopPropagation={() => goto('/')}
			on:keypress={() => {}}
			role="button"
			tabindex="-1"
		></i>
	</div>
	<button
		class="btn variant-filled-surface border border-black"
		on:click|stopPropagation={() => {
			goto('/quizes/newQuiz');
		}}
		>Create Quiz
	</button>
	{#each $Quizes.arr as q}
		<div
			class="p-3 card card-hover cursor-pointer w-300"
			role="none"
			on:click|stopPropagation={() => goto(`/quizes/${q._id}`)}
		>
			{#if q.isDeleted}
				<div class="text-2xl text-red-500">Deleted</div>
			{/if}
			{#if $user.email === q.createdBy}
				<i
					class="fas fa-trash-alt"
					role="none"
					on:click|stopPropagation={() => {
						Quizes.remove(q._id)
							.then((res) => {})
							.then(() => {
								$Takes.arr
									.filter((t) => t.quizID === q._id)
									.forEach((take) => {
										Takes.remove(take._id);
									});
							});
					}}
				></i>
			{/if}
			<div class="h2 text-center">{q.name}</div>
			<div class="flex flex-wrap">
				{#each q.fields as f}
					<div class="card chip">{fieldNames[f]}</div>
				{/each}
			</div>
			<div class="text-xs my-2">created by: {q.createdBy}</div>
		</div>
	{/each}
</div>
