<script>
	import { getModalStore } from '@skeletonlabs/skeleton';

	let modalStore = getModalStore();
	export let question;
	let correct = question.answers.correct;
	let wrong = question.answers.wrong;
	let none = question.answers.none;
	let combined = [...correct, ...wrong];
	let result = question.answers.result;
	const createID = (val) => {
		if (question.field === 'duration') {
			return `${val.duration}|${val.onset}|${val.peak}`;
		} else return val;
	};
	let values = combined.map((c) => createID(c.value));
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
</script>

<div class="flex flex-col p-7 items-center min-w-600 min-h-600 card">
	<div class="h2">{question.drug}</div>
	<div class="flex flex-col space-y-7 items-start">
		<div class="text-2xl">
			<div class="text-3xl">Picked</div>
			{#if result && none}
				<div class="text-green-500 ml-7">None of the above</div>
			{:else if !result && none}
				<div class="text-red-500 ml-7">None of the above</div>
			{/if}
			{#if !none}
				{#if question.field === 'duration'}
					<table class="table">
						<thead>
							<tr>
								{#each durationFields as f}
									<th class="font-bold">{f.label}</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each combined as a}
								<tr>
									{#each durationFields as f}
										<td class:text-green-500={a.answer} class:text-red-500={!a.answer}
											>{a.value[f.field]}</td
										>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				{:else}
					{#each combined as a}
						<div class:text-green-500={a.answer} class:text-red-500={!a.answer} class=" my-3 ml-7">
							{a.value}
						</div>
					{/each}
				{/if}
			{/if}
		</div>
		<div class="text-2xl">
			<div class="text-3xl">Not Picked</div>
			{#if question.field === 'duration'}
				<table class="table">
					<thead>
						<tr>
							{#each durationFields as f}
								<th class="font-bold">{f.label}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each question.choices.filter((ch) => !values.includes(createID(ch.value))) as c}
							<tr>
								{#each durationFields as f}
									<td class:text-green-500={c.answer} class:text-red-500={!c.answer}
										>{c.value[f.field]}</td
									>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				{#each question.choices.filter((ch) => !values.includes(createID(ch.value))) as c}
					<div class:text-green-500={c.answer} class:text-red-500={!c.answer} class="my-3 ml-7">
						{c.value}
					</div>
				{/each}
			{/if}
			{#if question.choices.filter((ch) => ch.answer && !values.includes(createID(ch.value))).length === 0 && !result && !none}
				<div class="text-green-500 ml-7">None of the above</div>
			{:else if question.choices.filter((ch) => ch.answer).length > 0 && !none}
				<div class="text-red-500 ml-7">None of the above</div>
			{/if}
		</div>
	</div>
	<button class="btn border border-white" on:click|stopPropagation={modalStore.close}>Close</button>
</div>
