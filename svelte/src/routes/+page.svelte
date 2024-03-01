<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/feathers/index.js';
</script>

<div class="flex w-full h-[100vh] flex-col space-y-12 justify-center items-center">
	<button
		class="btn variant-filled-surface border border-white"
		on:click|stopPropagation={() => {
			goto('/drugs');
		}}
		>Drugs
	</button>
	<button
		class="btn variant-filled-surface border border-white"
		on:click|stopPropagation={() => {
			goto('/quizes');
		}}
		>Quizzes
	</button>
	<button
		class="btn variant-filled-surface border border-white"
		on:click|stopPropagation={() => {
			auth.logOut();
		}}
		>Logout
	</button>
</div>
