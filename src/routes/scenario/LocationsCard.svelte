<script lang="ts">
	import type { LocationSet } from '$lib/database/queries/locations';
	import Map from '$lib/svg/Map.svelte';
	import { fade } from 'svelte/transition';

	export let locations: LocationSet[] | null = null;

	let selection = false;
	$: selected = locations ? locations.map((_) => false) : [];
</script>

<!-- Locations -->
<div class="card bg-base-200 w-full text-neutral-content">
	<div class="card-body">
		<div class="flex flex-row items-center">
			<div class="text-3xl font-bold pb">Locations</div>
			{#if !locations}
				<div class="loading loading-spinner loading-lg" style="margin-left: auto" />
			{/if}
		</div>

		{#if locations}
			<div in:fade class="overflow-x-auto pt-4">
				<table class="table">
					<!-- head -->
					<thead>
						<tr>
							<th />
							<th>Name</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						{#each locations as location}
							<tr>
								<th>
									{#if selection}
										<input type="checkbox" class="checkbox" disabled={location.owner === 'public'} />
									{:else}
										<Map />
									{/if}
								</th>
								<td>{location.name}</td>
								<td>{location.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		{#if selection}
			<div in:fade class="flex flex-row place-content-end justify-items-end" />
		{/if}

		<div in:fade class="flex flex-row place-content-end justify-items-end">
			<div>
				{#if selection}
					<button class="btn btn-ghost" style="margin-right: auto">Delete Selected</button>
                    <button class="btn btn-ghost" on:click={() => (selection = false)}>Done</button>
                {:else}
                    <button class="btn btn-ghost" on:click={() => (selection = true)}>
                        Edit Locations
                    </button>
                    <button class="btn btn-ghost">Upload New</button>
                {/if}
			</div>
		</div>
	</div>
</div>
