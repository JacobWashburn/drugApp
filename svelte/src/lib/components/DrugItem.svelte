<script>
	import InputGroup from '../../routes/InputGroup.svelte';

	export let field;
	export let label;
	export let values;
	export let removeItem;
	export let newItem;
</script>

<div class="flex w-fit">
	<div class="h3">
		{label}
		<span
			><i
				class="fas fa-circle-plus"
				on:click|stopPropagation={() => newItem(field)}
				on:keypress={() => {}}
				role="button"
				tabindex="-1"
			></i></span
		>
	</div>
	<div class="flex flex-col w-fit">
		{#each values as value, i}
			<InputGroup>
				<div class="flex justify-center items-center">
					<textarea class="bg-transparent" bind:value rows="2" cols="100" />
				</div>
				<div class="flex justify-start">
					<i
						class="fas fa-circle-minus text-red-500 text-xl"
						on:click|stopPropagation={() => removeItem(field, i)}
						on:keypress={() => {}}
						role="button"
						tabindex="-1"
					></i>
				</div>
			</InputGroup>
		{/each}
	</div>
</div>
