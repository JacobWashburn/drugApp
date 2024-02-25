<script>
	export let fields;
	export let drug;
	let labelFields = [
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
		},
		{
			label: 'Duration',
			field: 'duration'
		},
		{
			label: 'Considerations',
			field: 'notes'
		}
	].filter((f) => fields.includes(f.field));
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
</script>

<div class="flex flex-col justify-center items-center w-full text-xl">
	{#each labelFields as f}
		{#if f.field === 'duration'}
			<div class="flex w-full border border-surface-500 p-3">
				<div class="text-2xl w-1/4 mr-7">Duration</div>
				<div class="w-3/4 flex flex-col space-y-3">
					{#each drug.duration as d}
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
		{:else if f.field === 'notes'}
			<div class="flex w-full border border-surface-500 p-3">
				<div class="text-2xl w-1/4 mr-7">Considerations</div>
				<div class="w-3/4 flex flex-col space-y-2">
					<div class="">{drug.notes}</div>
				</div>
			</div>
		{:else}
			<div class="flex w-full border border-surface-500 p-3">
				<div class="text-2xl w-1/4 mr-7">{f.label}</div>
				<div class="w-3/4 flex flex-col space-y-2">
					{#each drug[f.field] as item}
						<div class="">{item}</div>
					{/each}
				</div>
			</div>
		{/if}
	{/each}
</div>
