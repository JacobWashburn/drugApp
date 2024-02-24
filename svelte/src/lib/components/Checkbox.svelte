<script>
	import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();

	export let checked;
	export let clickable = true;
	export let name = 'value';
	export let id = 'chk-box';
	export let size = '25px';
	export let borderColor = '';
	export let foregroundColor = '';
	export let backgroundColor = '';
	$: dispatch('change', checked);
	$: dispatch('click', checked);
</script>

{#if clickable}
	<div
		role="none"
		on:click|stopPropagation={(e) => {
			checked = !checked;
		}}
		class="flex flex-col justify-center items-center"
		style="width: {size}; height: {size}; border-color: {borderColor}; background-color: {backgroundColor}; border"
	>
		<input type="checkbox" {name} {id} bind:checked />
		<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class:checked>
			<path
				d="M 10 40 L 40 70 L 85 15"
				stroke={foregroundColor}
				stroke-dasharray="140"
				stroke-dashoffset={checked ? 0 : 140}
			/>
		</svg>
	</div>
{:else}
	<div
		class="flex flex-col justify-center items-center"
		style="width: {size}; height: {size}; border-color: {borderColor}; background-color: {backgroundColor}; border"
	>
		<input type="checkbox" {name} {id} bind:checked />
		<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class:checked>
			<path
				d="M 10 40 L 40 70 L 85 15"
				stroke={foregroundColor}
				stroke-dasharray="140"
				stroke-dashoffset={checked ? 0 : 140}
			/>
		</svg>
	</div>
{/if}

<style lang="postcss">
	div {
		position: relative;
		border: 3px solid black;
		background-color: #ffffff;
		border-radius: 10%;
		cursor: pointer;
	}
	svg {
		width: 100%;
		height: 100%;
		pointer-events: none;
		stroke: black;
		cursor: pointer;
	}
	path {
		stroke-width: 20;
		fill: none;
		transition: stroke-dashoffset 0.2s ease-in 0s;
	}
	input[type='checkbox'] {
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}
</style>
