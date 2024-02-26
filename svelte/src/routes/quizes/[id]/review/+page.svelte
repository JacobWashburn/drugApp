<script>
	import { goto } from '$app/navigation';
	import ReviewDetails from './ReviewDetails.svelte';

	export let data;
	console.log(data);
	let currentIndex = 0;
	$: ready = currentIndex === data.drugs.length - 1;
	$: drug = data.drugs[currentIndex];
	const next = () => {
		currentIndex++;
	};
	const back = () => {
		currentIndex--;
	};
	const finish = () => {
		goto(`/quizes/${data.quiz._id}`);
	};
</script>

<div class="flex flex-col w-full justify-center items-center p-12">
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
	<div class="text-2xl">
		{drug.name}
	</div>
	<ReviewDetails {drug} fields={data.quiz.fields} />
	<div class="flex space-x-12">
		<button
			class="btn border border-surface-600"
			class:hidden={currentIndex === 0}
			on:click|stopPropagation={back}
		>
			Back
		</button>
		{#if !ready}
			<button class="btn border border-surface-600" on:click|stopPropagation={next}>Next</button>
		{:else}
			<button class="btn border border-surface-600" on:click|stopPropagation={finish}
				>Finish
			</button>
		{/if}
	</div>
</div>
