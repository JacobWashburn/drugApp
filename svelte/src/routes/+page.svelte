<script>
	import { goto } from '$app/navigation';
</script>

<div class="flex w-full h-[100vh] flex-col justify-center items-center">
	<button
		class="btn variant-filled-surface border border-black"
		on:click|stopPropagation={() => {
			goto('/drugs');
		}}
		>Drugs
	</button>
	<button
		class="btn variant-filled-surface border border-black"
		on:click|stopPropagation={() => {
			goto('/quizes');
		}}
		>Quizzes
	</button>
</div>
