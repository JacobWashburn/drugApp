<script>
	import { services } from '$lib/feathers/index.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { Drugs, Users } = services;
	let fields = [
		{
			label: 'Class',
			field: 'class'
		},
		{
			label: 'Mechanism',
			field: 'mechanism'
		},
		{
			label: 'Indications',
			field: 'indications'
		},
		{
			label: 'Contraindications',
			field: 'contraindications'
		},
		{
			label: 'Side Effects',
			field: 'sideEffects'
		},
		{
			label: 'Interactions',
			field: 'interactions'
		},
		{
			label: 'Adult Dosage',
			field: 'adultDosage'
		},
		{
			label: 'Pediatric Dosage',
			field: 'pedDosage'
		}
	];
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
	export let data;
	$: drug = $Drugs.key[data.id];
</script>

<div class="flex w-full h-full overflow-y-auto flex-col justify-start items-center p-12">
	<div class="self-start">
		<i
			class="fas fa-arrow-alt-circle-left text-2xl"
			on:click|stopPropagation={() => goto('/drugs', { state: $page.state })}
			on:keypress={() => {}}
			role="button"
			tabindex="-1"
		></i>
	</div>
	<div class="h1 mb-2">{drug?.name}</div>
	<div class="text-xs mb-1">Submitted by: {$Users.key[drug.createdBy]?.username || ''}</div>
	<div class="text-xs mb-7">Last Edit by: {$Users.key[drug.updatedBy]?.username || ''}</div>
	{#each fields as f}
		<div class="flex w-full border border-surface-500 p-3">
			<div class="text-2xl w-1/4 mr-7">{f.label}</div>
			<div class="w-3/4 flex flex-col space-y-2">
				{#each drug?.[f.field] || [] as item}
					<div class="">{item}</div>
				{/each}
			</div>
		</div>
	{/each}
	<div class="flex w-full border border-surface-500 p-3">
		<div class="text-2xl w-1/4 mr-7">Duration</div>
		<div class="w-3/4 flex flex-col space-y-3">
			{#each drug?.duration || [] as d}
				<div class="flex flex-col">
					{#each durationFields as f}
						<div class="flex space-x-3">
							<div class="font-bold">{f.label}</div>
							<div class="">{d[f.field]}</div>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
	<div class="flex w-full border border-surface-500 p-3">
		<div class="text-2xl w-1/4 mr-7">Considerations</div>
		<div class="w-3/4 flex flex-col space-y-2">
			<div class="">{drug?.notes}</div>
		</div>
	</div>
</div>
