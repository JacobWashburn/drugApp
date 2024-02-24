<script>
	import { Autocomplete, InputChip, popup } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();
	export let drugs;
	export let chips;
	let inputValue = '';
	$: options = drugs
		.filter(
			(v) => !chips.includes(v.name) && v.name.toLowerCase().includes(inputValue.toLowerCase())
		)
		.map((v) => ({ value: v.name, label: v.name, keywords: v.name.split(' ').join(',') }));

	let popupSettings = {
		event: 'click',
		target: `popupAutocomplete`,
		placement: 'bottom'
	};

	const handleSelect = (e) => {
		if (!chips.includes(e.detail.label)) {
			chips = [...chips, e.detail.label];
		}

		handleChange(false);
	};

	const handleChange = (reset = true) => {
		if (reset) {
			inputValue = '';
		}
		dispatch('change', chips);
	};
</script>

<div class="max-w-600">
	<div class="" use:popup={popupSettings}>
		<InputChip
			bind:value={chips}
			name={'-chips'}
			on:add={handleChange}
			on:input={(e) => {
				inputValue = e.target.value;
			}}
			on:remove={handleChange}
		/>
	</div>
	<div class="variant-filled-surface p-1 rounded-xl z-50" data-popup={`popupAutocomplete`}>
		<Autocomplete
			on:selection={handleSelect}
			{options}
			regionItem="hover:bg-slate-400 rounded-3xl"
		/>
		<div class="arrow variant-filled-surface" />
	</div>
</div>
