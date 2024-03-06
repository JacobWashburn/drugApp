<script>
	import InputGroup from '../../routes/InputGroup.svelte';
	import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();

	export let field;
	export let label;
	export let values;
	export let removeItem;
	export let newItem;
</script>

<div class="flex w-fit mb-7">
	<div class="h3 w-250">
		{label}
		<span>
			<i
				class="fas fa-circle-plus text-4xl"
				on:click|stopPropagation={() => newItem(field)}
				on:keypress={() => {}}
				role="button"
				tabindex="-1"
			></i>
		</span>
	</div>
	<div class="flex flex-col w-fit relative max-h-350 overflow-y-auto">
		<div class="flex flex-col">
			{#each values as value, i}
				<InputGroup>
					<div class="flex justify-center items-center">
						<textarea
							class="bg-transparent"
							id={`${field}-${i}`}
							on:input={() => dispatch('change')}
							on:keypress={(e) => {
								console.log(e);
								if (e.key === 'Enter') {
									newItem(field);
									setTimeout(() => {
										let next = document.getElementById(`${field}-${i + 1}`);
										if (next) {
											next.focus();
										}
									}, 100);
								}
							}}
							bind:value
							rows="2"
							cols="100"
						/>
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
</div>
