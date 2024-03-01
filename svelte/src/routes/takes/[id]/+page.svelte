<script>
	import { services } from '$lib/feathers/index.js';
	import Question from './Question.svelte';
	import dayjs from 'dayjs';
	import { goto } from '$app/navigation';

	let { Takes } = services;
	export let data;
	let currentIndex = data.take.questionIndex;
	$: console.log({ data });
	let elapsedTime = data.take.elapsedTime;
	let start = dayjs();
	let end = dayjs().add(elapsedTime, 'ms');

	$: hours = Math.floor(end.diff(start, 'h'));
	$: minutes = Math.floor(end.diff(start, 'm')) - (hours > 0 ? hours * 60 : 0);
	$: seconds = Math.floor(end.diff(start, 's')) - (minutes > 0 ? minutes * 60 : 0);

	function updateTimer() {
		end = dayjs().add(elapsedTime, 'ms');
	}

	let interval = setInterval(updateTimer, 1000);

	function padValue(value, length = 2) {
		const { length: currentLength } = value.toString();
		if (currentLength >= length) return value.toString();
		return `0${value}`;
	}

	let next = () => {
		let question = data.take.questions[currentIndex];
		let allQs = data.take.questions.filter((q) => q.field === question.field);
		if (question.answers.result) {
			data.take[question.field].correct.push(question);
		} else {
			data.take[question.field].wrong.push(question);
		}
		data.take[question.field].result =
			data.take[question.field].correct.length * (100 / allQs.length);

		currentIndex++;
		data.take.questionIndex = currentIndex;
		data.take.elapsedTime = end - start;
		Takes.patch(data.take._id, data.take);
	};
	const submit = () => {
		clearInterval(interval);
		data.take.submitted = dayjs().format('YYYY-MM-DD h:mm:ss a');
		data.take.time = `${padValue(hours)}:${padValue(minutes)}:${padValue(seconds)}`;
		let allQs = data.take.questions;
		let correct = 0;
		for (const field of data.quiz.fields) {
			correct += data.take[field].correct.length;
		}
		data.take.score = correct * (100 / allQs.length);
		Takes.patch(data.take._id, data.take).then(() => {
			goto(`/quizes/${data.quiz._id}`);
		});
	};

	$: disabledButton = data.take.questions?.[currentIndex]?.answers?.none
		? data.take.questions?.[currentIndex]?.answers?.correct?.length === 0 &&
			data.take.questions?.[currentIndex]?.answers?.wrong?.length === 0
		: data.take.questions?.[currentIndex]?.answers?.correct?.length > 0 ||
			data.take.questions?.[currentIndex]?.answers?.wrong?.length > 0;
</script>

<div class="flex flex-col justify-center items-center space-y-7 p-12">
	<div class="h1">{data.quiz.name}</div>
	<div class="text-2xl w-150 text-center">
		{padValue(hours)}:{padValue(minutes)}:{padValue(seconds)}
	</div>
	<div class="text-2xl" class:hidden={currentIndex >= data.take.questions.length}>
		{currentIndex + 1} of {data.take.questions.length}
	</div>
	{#if currentIndex < data.take.questions.length}
		<Question bind:question={data.take.questions[currentIndex]} bind:take={data.take} />
		<button
			class="btn border border-white"
			disabled={!disabledButton}
			on:click|stopPropagation={next}
			>Next
		</button>
	{:else}
		<div class="h2">All done!</div>
		<button class="btn border border-white" on:click|stopPropagation={submit}>Submit</button>
	{/if}
</div>
