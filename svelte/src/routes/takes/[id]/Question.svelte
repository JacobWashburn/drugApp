<script>
	import Checkbox from '$lib/components/Checkbox.svelte';

	export let take;
	export let question;
	let checked = question.choices.reduce((acc, curr) => {
		acc[curr.value] = false;
		return acc;
	}, {});
	const createID = (val) => {
		if (question.field === 'duration') {
			return `${val.duration}|${val.onset}|${val.peak}`;
		} else return val;
	};
	let currentID = `${question.drug}|${question.field}`;
	$: if (currentID !== `${question.drug}|${question.field}`) {
		currentID = `${question.drug}|${question.field}`;
		checked = question.choices.reduce((acc, curr) => {
			acc[createID(curr.value)] = false;
			return acc;
		}, {});
	}
	const mark = (choice, check) => {
		if (check) {
			if (choice.answer) {
				question.answers.correct = [...question.answers.correct, choice];
			} else {
				question.answers.wrong = [...question.answers.wrong, choice];
			}
		} else {
			if (choice.answer) {
				question.answers.correct = question.answers.correct.filter(
					(item) => item.value !== choice.value
				);
			} else {
				question.answers.wrong = question.answers.wrong.filter(
					(item) => item.value !== choice.value
				);
			}
		}
		if (question.answers.none) {
			question.answers.result =
				question.answers.wrong.length === 0 &&
				question.answers.correct.length === 0 &&
				allCorrect();
		} else {
			question.answers.result = question.answers.wrong.length === 0 && allCorrect();
		}
	};
	let allCorrect = () =>
		question.choices.filter((c) => c.answer).length === question.answers.correct.length;
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

<div class="flex flex-col justify-center items-center space-y-7">
	<div class="h2">{question.drug}</div>
	<div class="h3">
		{question.label}
	</div>
	<table class="">
		{#each question.choices as c}
			<tr
				class="cursor-pointer"
				on:click|stopPropagation={() => {
					let id = createID(c.value);
					checked[id] = !checked[id];
					mark(c, checked[id]);
				}}
			>
				<td class="pr-4 py-1.5">
					<Checkbox clickable={false} checked={checked[createID(c.value)]} />
				</td>
				<td class="text-xl" class:text-green-600={checked[createID(c.value)]}>
					{#if question.field === 'duration'}
						<table class="mb-7">
							{#each durationFields as f}
								<tr>
									<td>{f.label}</td>
									<td>{c.value[f.field]}</td>
								</tr>
							{/each}
						</table>
					{:else}
						{c.value}
					{/if}
				</td>
			</tr>
		{/each}
		<tr
			class="cursor-pointer"
			on:click|stopPropagation={() => {
				question.answers.none = !question.answers.none;
				if (question.answers.none) {
					question.answers.result =
						question.answers.wrong.length === 0 &&
						question.answers.correct.length === 0 &&
						allCorrect();
					question.answers.none = true;
				} else {
					question.answers.result = question.answers.wrong.length === 0 && allCorrect();
				}
			}}
		>
			<td class="pr-4 py-1">
				<Checkbox checked={question.answers.none} clickable={false} />
			</td>
			<td class:text-green-600={question.answers.none}>None of the above</td>
		</tr>
	</table>
</div>
