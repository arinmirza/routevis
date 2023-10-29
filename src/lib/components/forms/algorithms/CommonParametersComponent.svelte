<script lang="ts" context='module'>
    export type CommonParameters = {
        locations: string;
        durationMatrix: string;
        demands: 'uniform-unit' | 'custom';
        capacities: 'uniform-unit' | 'custom';
        customDemands: string;
        customCapacities: string;
        initialLoads: string | null;
        initialLocations: string | null;
    }
</script>
<script lang="ts">
	import { fade } from 'svelte/transition';

    export let parameters: CommonParameters;
    export let showAdvanced = false;
	export let showExplanations = false;
</script>

<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
	<div class="form-control" style="min-width: 28rem">
		<label class="label" for="locations-dropdown">
			<span class="label-text">Locations</span>
			<span class="label-text-alt">JSON</span>
		</label>
		<select class="select select-bordered" id="locations-dropdown">
			<option selected>Munich Preset 1</option>
			<option>Munich Preset 2</option>
			<option>Munich Preset 3</option>
		</select>
		<label class="label" for="locations-dropdown">
			<span class="label-text text-gray-500">58 elements</span>
		</label>
	</div>

	{#if showExplanations}
		<div class="divider lg:divider-horizontal" />
		<div class="max-w-md">
			<p>
				Set of locations for solving the vehicle routing problem. The first location is always considered as the
				warehouse, and the remaining locations are the customers.
			</p>
		</div>{/if}
</div>

<!-- Duration Matrix Selection  -->

<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
	<div class="form-control" style="min-width: 28rem;">
		<label class="label" for="locations-dropdown">
			<span class="label-text">Duration Matrix</span>
			<span class="label-text-alt">JSON</span>
		</label>
		<select class="select select-bordered" id="locations-dropdown">
			<option selected>Munich Location Preset 1</option>
			<option>Harry Potter</option>
			<option>Lord of the Rings</option>
			<option>Planet of the Apes</option>
			<option>Star Trek</option>
		</select>
		<label class="label" for="locations-dropdown">
			<span class="label-text text-gray-500">58 elements</span>
		</label>
	</div>

	{#if showExplanations}
		<div class="divider lg:divider-horizontal" />
		<div class="max-w-md">
			<p>
				A 3-dimensional duration matrix which represents the travel times between each location pair, at a given time of
				the day.
			</p>
		</div>
	{/if}
</div>

<!-- Demands Selection -->

<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
	<div class="form-control" style="min-width: 28rem;">
		<label class="label" for="locations-dropdown">
			<span class="label-text">Demands</span>
			<span class="label-text-alt">JSON</span>
		</label>
		<select class="select select-bordered" id="locations-dropdown" bind:value={parameters.demands}>
			<option value="uniform-unit" selected>Uniform Unit Distribution</option>
			<option value="custom">Custom Demands</option>
		</select>

		{#if parameters.demands === 'custom'}
			<div transition:fade class="pt-2" style="max-width: 28rem;">
				<textarea class="textarea textarea-bordered w-full" name="custom-demands" bind:value={parameters.customDemands} />
				<label class="label" for="custom-demands">
					<span class="label-text text-gray-500">
						Provide a JSON array consisting of comma separated integers.<br />
						The i-th value represents the demand of the i-th customer. <br />
						The first value must be 0, as it corresponds to the warehouse.
					</span>
				</label>
			</div>
		{/if}
	</div>

	{#if showExplanations}
		<div class="divider lg:divider-horizontal" />
		<div class="max-w-md">
			<p>
				The demands of the customers. A vehicle will only visit a customer if it can satisfy that customer's demand.
			</p>
		</div>
	{/if}
</div>

<!-- Capacities Selection -->

<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
	<div class="form-control" style="min-width: 28rem;">
		<label class="label" for="locations-dropdown">
			<span class="label-text">Capacities</span>
			<span class="label-text-alt">JSON</span>
		</label>
		<select class="select select-bordered" id="locations-dropdown" bind:value={parameters.capacities}>
			<option value="uniform-unit" selected>Homogenous Small Trucks</option>
			<option value="custom">Custom Capacities</option>
		</select>

		{#if parameters.capacities === 'custom'}
			<div transition:fade class="pt-2" style="max-width: 28rem;">
				<textarea class="textarea textarea-bordered w-full" name="custom-capacities" bind:value={parameters.customCapacities} />
				<label class="label" for="custom-capacities">
					<span class="label-text text-gray-500">
						Provide a JSON array consisting of comma separated integers.<br />
						The i-th value represents the capacity of the i-th vehicle. <br />
						The number of provided integers correspond to the number of vehicles in your fleet.
					</span>
				</label>
			</div>
		{/if}
	</div>

	{#if showExplanations}
		<div class="divider lg:divider-horizontal" />
		<div class="max-w-md">
			<p>
				The capacities of the vehicles. A vehicle needs to return back to the warehouse when its load is empty, or if
				there are no customers left whose demand can be satisfied in a time-effective way.
			</p>
		</div>
	{/if}
</div>

{#if showAdvanced}
	<div transition:fade>
		<!-- Inital Loads Input -->
		<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
			<div class="form-control" style="min-width: 28rem;">
				<div transition:fade class="pt-2" style="max-width: 28rem;">
					<label class="label" for="initial-loads">
						<span class="label-text"> Initial Loads </span>
					</label>
					<textarea class="textarea textarea-bordered w-full" name="initial-loads" bind:value={parameters.initialLoads} />
					<label class="label" for="initial-loads">
						<span class="label-text text-gray-500">
							Provide a JSON array consisting of comma separated integers.<br />
							The i-th value represents the initial load of the i-th vehicle. <br />
						</span>
					</label>
				</div>
			</div>

			{#if showExplanations}
				<div class="divider lg:divider-horizontal" />
				<div class="max-w-md">
					<p>
						Vehicles will start with the provided initial loads of supplies, but will fill their full capacitiy once
						they go back to the warehouse. This parameter is relevant when recalculating the VRP while the vehicles are
						already in transit.
					</p>
				</div>
			{/if}
		</div>

		<!-- Initial Locations Input -->
		<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
			<div class="form-control" style="min-width: 28rem;">
				<div transition:fade class="pt-2" style="max-width: 28rem;">
					<label class="label" for="initial-locations">
						<span class="label-text"> Initial Locations </span>
					</label>
					<textarea class="textarea textarea-bordered w-full" name="initial-locations" bind:value={parameters.initialLocations} />
					<label class="label" for="initial-locations">
						<span class="label-text text-gray-500">
							Provide a JSON array consisting of comma separated integers.<br />
							The i-th value represents the initial location of the i-th vehicle. <br />
						</span>
					</label>
				</div>
			</div>

			{#if showExplanations}
				<div class="divider lg:divider-horizontal" />
				<div class="max-w-md">
					<p>
						Vehicles will start at the provided locations. This parameter is relevant when recalculating the VRP while
						the vehicles are already in transit.
					</p>
				</div>
			{/if}
		</div>
	</div>
{/if}

