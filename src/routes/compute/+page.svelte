<script lang="ts">
	import CommonParametersComponent, { type CommonParameters } from '$lib/components/forms/algorithms/CommonParametersComponent.svelte';
	import SimulatedAnnealing, { type SimulatedAnnealingParameters } from '$lib/components/forms/algorithms/SimulatedAnnealing.svelte';
	import { fade, fly } from 'svelte/transition';


	let algorithm: 'sa' | 'ga' | 'ant' | null = null;
	let showAdvanced = false;

	/* Common Parameters */
	let commonParameters: CommonParameters = {
		locations: '',
        durationMatrix: '',
        demands: 'uniform-unit',
        capacities: 'uniform-unit',
        customDemands: '',
        customCapacities: '',
        initialLoads: null,
        initialLocations: null,
	}

	/* Ant Colony Optimization Parameters */
	// TODO

	/* Genetic Algorithm Parametes */
	// TODO

	/* Simulated Annealing Parameters */
	let saParameters: SimulatedAnnealingParameters = {
		initialTemperature: 50,
		cooldownFactor: 50,
		iterateFor: 50,
		terminationAfter: 50,
		equalWorkIncentive: 50,
	}


	let status: 'input' | 'solving' | 'done' = 'done';

	function solve() {
		status = 'solving';
	}
</script>

<div id="content-wrapper" class="p-9 flex flex-col content-center items-center">
	<div id="main-content">
		<div id="title" class="text-4xl font-bold pb-8 text-center">Computation</div>

		<!-- Scenario Card -->
		<div class="card bg-base-200 w-full text-neutral-content">
			<div class="card-body">
				<div id="title" class="text-3xl font-bold pb-4">Scenario</div>

				<!-- Common Parameters -->
				<CommonParametersComponent
					bind:parameters={commonParameters}
					bind:showAdvanced
					showExplanations />

				<!-- Advanced Parameters Button -->
				<div class="flex flex-row place-content-end justify-items-end">
					<div>
						<button
							class="btn btn-ghost"
							on:click={() => {
								showAdvanced = !showAdvanced;
							}}>
							{showAdvanced ? 'Hide' : 'Show'} Advanced Parameters
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="p-2" />

		<!-- Algorithm Card-->
		<div class="card bg-base-200 w-full text-neutral-content">
			<div class="card-body">
				<div id="title" class="text-3xl font-bold pb-4">Method</div>

				<!-- Algorithm Selection  -->

				<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
					<div class="form-control" style="min-width: 28rem;">
						<label class="label" for="locations-dropdown">
							<span class="label-text">Algorithm</span>
						</label>
						<select class="select select-bordered" id="locations-dropdown" bind:value={algorithm}>
							<option value={null} disabled selected>Select a VRP solver</option>
							<option value="ant" disabled>Ant Colony Optimization</option>
							<option value="ga" disabled>Genetic Algorithm</option>
							<option value="sa">Simulated Annealing</option>
						</select>
					</div>

					<div class="divider lg:divider-horizontal" />
					<div class="max-w-md">
						<p>Algorithm to solve the time-dependent multi-vehicle routing problem.</p>
					</div>
				</div>

				<!-- Algorithm Options -->

				{#if algorithm === 'sa'}
					<SimulatedAnnealing
						bind:parameters={saParameters}
						showExplanations />
				{/if}

				<div class="flex flex-row place-content-end justify-items-end">
					<div>
						<button class="btn btn-ghost">Show Api Call</button>
						<button class={`btn btn-loading ${status === 'solving' ? 'btn-disabled' : 'btn-secondary'}`} on:click={solve}>
							Solve and Save
						</button>
						<button class={`btn btn-loading ${status === 'solving' ? 'btn-disabled' : 'btn-primary'}`} on:click={solve}>
							Solve
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="p-2" />

		<!-- Result Card -->
		<div class="card bg-base-200 w-full text-neutral-content">
			<div class="card-body">
				<div id="title" class="text-3xl font-bold pb-4">Result</div>

				{#if status === 'solving'}
					<div transition:fade class="flex place-content-center">
						<div class="max-w-md">
							<progress class="progress min-w-md" />
							<div class="text-center pt-4">
								<div>Solving, this may take a minute or two..</div>
							</div>
						</div>
					</div>
				{:else if status === 'input'}
					<p>No result available yet.</p>
				{:else if status === 'done'}
					<div class="stats shadow">
						<div class="stat">
							<div class="stat-figure text-secondary">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									class="inline-block w-8 h-8 stroke-current"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
							</div>
							<div class="stat-title">Downloads</div>
							<div class="stat-value">31K</div>
							<div class="stat-desc">Jan 1st - Feb 1st</div>
						</div>

						<div class="stat">
							<div class="stat-figure text-secondary">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									class="inline-block w-8 h-8 stroke-current"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
							</div>
							<div class="stat-title">New Users</div>
							<div class="stat-value">4,200</div>
							<div class="stat-desc">↗︎ 400 (22%)</div>
						</div>

						<div class="stat">
							<div class="stat-figure text-secondary">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									class="inline-block w-8 h-8 stroke-current"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
							</div>
							<div class="stat-title">New Registers</div>
							<div class="stat-value">1,200</div>
							<div class="stat-desc">↘︎ 90 (14%)</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
