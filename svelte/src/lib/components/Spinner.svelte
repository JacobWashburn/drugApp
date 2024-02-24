<script>
	import * as spinners from 'svelte-loading-spinners';

	export let position = 'fixed';
	export let zindex = 1000;
	export let size = '60';
	export let options = {
		component: 'Stretch',
		color: '#9A4625',
		unit: 'px',
		duration: '1s'
	};
	let { component = 'Stretch', color = '#9A4625', unit = 'px', duration = '1s' } = options;
</script>

<div
	class="spinner flex flex-col items-center justify-center"
	style={`position: ${position}; z-index: ${zindex}`}
>
	<svelte:component
		this={spinners?.[component] || spinners.Stretch}
		{color}
		{duration}
		{size}
		{unit}
	/>
</div>

<style lang="postcss">
	.spinner {
		background-color: rgba(0, 0, 0, 0.7);
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
	}
</style>
