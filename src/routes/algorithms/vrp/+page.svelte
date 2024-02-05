<script lang="ts">
	import { page } from '$app/stores';
	import LockIcon from '$lib/svg/LockIcon.svelte';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { PageData } from './$types';
	import type { DurationMatrix, LocationGroup, Solution } from '$lib/types/map';
	import axios from 'axios';
	import InspectApiModal from '$lib/components/debug/InspectAPIModal.svelte';
	import { fade } from 'svelte/transition';

	export let data: PageData;

	/* Login Modal */
	$: session = $page.data.session;
	let loginModalOpen = getContext<Writable<boolean>>('loginModal');

	/* Stored data */
	let locations: LocationGroup[] = [];
	let durations: DurationMatrix[] = [];
	let solutions: Solution[] = [];

	/* Toggle Parameters */
	let showAdvancedParameters = false;
	let showMetaParameters = false;

	let aco_showMetaParameters = false;
	let ga_showMetaParameters = false;
	let sa_showMetaParameters = false;

	let showApiCall = false;
	let loadingLocations = false;
	let loadingDurations = false;

	/* Algorithm Selection */
	let selectedAlgorithm: 'sa' | 'ga' | 'aco' | null = null;

	/* Technical variables */
	let waitingResponse = false;
	let receivedResponse = false;
	let aco_responses: any[] = [];
	let ga_responses: any[] = [];
	let sa_responses: any[] = [];
	let total_responses = 0;

	/* Helper methods */
	function nonNegativeInt(str: string) {
		const value = parseInt(str);
		return value && value >= 0 ? value : 0;
	}

	function int(str: string) {
		const value = parseInt(str);
		return value ? value : 0;
	}

	function prettyTimestamp(ts: string) {
		const date = ts.split('T')?.[0];
		const time = ts.split('T')?.[1]?.split('.')?.[0];
		return `${date} ${time}`;
	}

	/* Database Parameters */
	let locationsKey: number;
	let durationsKey: number;

	/* Common Form Parameters */
	let _vehicleCapacity: string = '1';
	let _vehicleCount: string = '1';
	$: vehicleCapacity = nonNegativeInt(_vehicleCapacity);
	$: vehicleCount = nonNegativeInt(_vehicleCount);
	$: vehicleCount, (() => (_startTimesOfVehicles = Array(vehicleCount).fill(0).join(', ')))();

	/* Advanced Form Parameters */
	let _ignoredCustomers: string = '';
	let _completedCustomers: string = '';
	let _startTimesOfVehicles: string = '';
	$: ignoredCustomers = _ignoredCustomers ? _ignoredCustomers.split(',').map((id) => nonNegativeInt(id)) : [];
	$: completedCustomers = _completedCustomers ? _completedCustomers.split(',').map((id) => nonNegativeInt(id)) : [];
	$: startTimesOfVehicles = _startTimesOfVehicles.split(',').map((id) => nonNegativeInt(id));
	$: vehicleCapacities = Array(vehicleCount).fill(vehicleCapacity);

	/* Solution Describers */
	let solutionName: string = '';
	let solutionDescription: string = '';

	/* Simulated Annealing Parameters */
	let sa_initialTemperature = '1000';
	let sa_cooldownFactor = '0.7';
	let sa_slowdownFactor = '100';
	let sa_iterationCount = '1000';
	let sa_max_cycles = '5';

	/* Ant Colony Optimization Parameters */
	let aco_nHyperparams = '3';
	let aco_considerDepots = false;
	let aco_solver = 'ACO_VRP_2';
	let aco_pheromoneUseFirstHour = false;
	let aco_rangeNIterations = '25, 50';
	let aco_rangeNSubIterations = '5, 10';
	let aco_rangeQ = '1, 1000';
	let aco_rangeAlpha = '2, 5';
	let aco_rangeBeta = '2, 5';
	let aco_rangeRho = '0.8, 1';

	/* Genetic Algorithm Parametes */
	let ga_multiThreaded: boolean = false;
	let ga_randomPermutationCount: string = '1000';
	let ga_iterationCount: string = '48';
	let ga_kLowerLimit = true;
	let ga_maxK = '-1';


	$: requestEndpoint = getEndpoint(selectedAlgorithm);

	function getEndpoint(selected: string | null) {
		console.log('getendpoint', selected);
		switch (selected) {
			case 'ga':
				return 'https://vrpms-rpke.vercel.app/api/vrp/ga';
			case 'aco':
				return 'https://vrpms-git-metehan-aco-mefarnis-projects.vercel.app/api/vrp/aco';
		}
		return '<ENDPOINT>';
	}

	let waitingAco = false;
	let waitingGa = false;
	let waitingSa = false;

	async function solve() {
		console.log('Sending request to endpoint:', requestEndpoint);

		waitingResponse = true;

		aco_responses[total_responses] = '?';
		ga_responses[total_responses] = '?';
		sa_responses[total_responses] = '?';

		try {
			(async () => {
				waitingAco = true;
				aco_responses[total_responses] = await axios.post(
				'https://vrpms-main.vercel.app/api/vrp/aco',
				{
					/* Common parameters */
					solutionName: '[ACO] ' + solutionName,
					solutionDescription,
					locationsKey,
					durationsKey,

					capacities: vehicleCapacities,
					startTimes: startTimesOfVehicles,
					ignoredCustomers,
					completedCustomers,
					auth: session?.access_token,

					/* Aco parameters */
					n_hyperparams: nonNegativeInt(aco_nHyperparams),
					consider_depots: aco_considerDepots,
					aco_sols: aco_solver,
					pheromone_uses_first_hour: aco_pheromoneUseFirstHour,
					range_n_iterations: aco_rangeNIterations ? aco_rangeNIterations.split(',').map((id) => parseFloat(id)) : [],
					range_n_sub_iterations: aco_rangeNSubIterations
						? aco_rangeNSubIterations.split(',').map((id) => nonNegativeInt(id))
						: [],
					range_q: aco_rangeQ ? aco_rangeQ.split(',').map((id) => nonNegativeInt(id)) : [],
					range_alpha: aco_rangeAlpha ? aco_rangeAlpha.split(',').map((id) => nonNegativeInt(id)) : [],
					range_beta: aco_rangeBeta ? aco_rangeBeta.split(',').map((id) => nonNegativeInt(id)) : [],
					range_rho: aco_rangeRho ? aco_rangeRho.split(',').map((id) => parseFloat(id)) : []
				},
				{
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
			waitingAco = false;
			})();
			
		} catch {}

		try {
			(async () => {
				waitingGa = true;
				ga_responses[total_responses] = await axios.post(
				'https://vrpms-main.vercel.app/api/vrp/ga',
				{
					/* Common parameters */
					solutionName: '[GA] ' + solutionName,
					solutionDescription,
					locationsKey,
					durationsKey,
					capacities: vehicleCapacities,
					startTimes: startTimesOfVehicles,
					ignoredCustomers,
					completedCustomers,
					auth: session?.access_token,

					/* GA parameters */
					multiThreaded: ga_multiThreaded,
					iterationCount: nonNegativeInt(ga_iterationCount),
					randomPermutationCount: nonNegativeInt(ga_randomPermutationCount),
					max_k: int(ga_maxK),
					k_lower_limit: ga_kLowerLimit
				},
				{
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
			waitingGa = false;
			})();
			
		} catch {}

		try {
			(async () => {
				waitingSa = true;
				sa_responses[total_responses] = await axios.post(
				'https://vrpms-main.vercel.app/api/vrp/sa',
				{
					/* Common parameters */
					solutionName: '[SA] ' + solutionName,
					solutionDescription,
					locationsKey,
					durationsKey,
					capacities: vehicleCapacities,
					startTimes: startTimesOfVehicles,
					ignoredCustomers,
					completedCustomers,
					auth: session?.access_token,

					/* SA parameters */
					cooldownFactor: nonNegativeInt(sa_cooldownFactor),
					slowdownMultiplier: nonNegativeInt(sa_slowdownFactor),
					totalIterations: nonNegativeInt(sa_iterationCount),
					initialTemperature: nonNegativeInt(sa_initialTemperature),
					maxCycles: nonNegativeInt(sa_max_cycles),
				},
				{
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
			waitingSa = false;
			})();
			
		} catch {}

		total_responses = total_responses + 1;
		waitingResponse = false;
		receivedResponse = true;
	}

	function findById<T extends { id: K }, K>(array: T[], id: K) {
		return array.find((elem) => elem?.id === id);
	}

	async function loadData() {
		(async () => {
			loadingLocations = true;
			locations = await data.query.locations.all();
			console.debug('locations:', locations);
			loadingLocations = false;
			locationsKey = locations?.[0].id;
		})();

		(async () => {
			loadingDurations = true;
			durations = await data.query.durations.all();
			console.debug('durations:', durations);
			loadingDurations = false;
			durationsKey = durations?.[0].id;
		})();
	}

	onMount(() => {
		loadData();
	});
</script>

<div id="content-wrapper" class="p-9 flex flex-col content-center items-center">
	<div id="main-content">
		<div id="title" class="text-4xl font-bold pb-8 text-center">VRP</div>

		<!-- Scenario Card -->
		<div class="card bg-base-200 w-full text-neutral-content">
			<div class="card-body">
				<!-- Scenario Card Title -->
				<div class="flex flex-row items-center">
					<div id="title" class="text-3xl font-bold pb-4">Problem</div>
					{#if loadingLocations || loadingDurations}
						<div class="loading loading-spinner loading-lg" style="margin-left: auto" />
					{/if}
				</div>

				<!--- Locations Selection -->
				<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
					<!-- Input -->
					<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
						<label class="label" for="locations-select">
							<span class="label-text">Locations</span>
						</label>
						<select class="select select-bordered" id="locations-select" bind:value={locationsKey}>
							{#each locations as location}
								<option value={location.id}>[{prettyTimestamp(location.created_at)}] {location.name}</option>
							{/each}
						</select>
						<label class="label" for="locations-select">
							<span class="label-text text-gray-500">
								<span class="font-bold">Description: </span>
								{findById(locations, locationsKey)?.description}
							</span>
						</label>
					</div>

					<div class="divider lg:divider-horizontal" />

					<!-- Description -->
					<div class="max-w-md">
						<p>
							A location set contains coordinates, names and demands of the customers. The only exception is that the
							first location is always considered as the warehouse.
						</p>
					</div>
				</div>

				<!-- Duration Matrix Selection -->
				<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
					<!-- Input -->
					<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
						<label class="label" for="duration-select">
							<span class="label-text">Duration Matrix</span>
						</label>
						<select class="select select-bordered" id="duration-select" bind:value={durationsKey}>
							{#each durations as duration}
								<option value={duration.id}>{duration.name}</option>
							{/each}
						</select>
						<label class="label" for="duration-select">
							<span class="label-text text-gray-500">
								<span class="font-bold">Description: </span>
								{findById(durations, durationsKey)?.description}
							</span>
						</label>
					</div>

					<div class="divider lg:divider-horizontal" />

					<!-- Description -->
					<div class="max-w-md">
						<p>
							A 3-dimensional duration matrix which represents the travel times between each location pair, at a given
							time of the day.
						</p>
					</div>
				</div>

				<!-- Vehicle Count  -->
				<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
					<!-- Input -->
					<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
						<label class="label" for="vehicle-count">
							<span class="label-text">Vehicle Count</span>
						</label>
						<input type="text" class="input input-bordered w-full" id="vehicle-count" bind:value={_vehicleCount} />
						<label class="label" for="vehicle-count">
							<span class="label-text text-gray-500"> Provide a non-negative integer. </span>
						</label>
					</div>

					<div class="divider lg:divider-horizontal" />

					<!-- Description -->
					<div class="max-w-md">
						<p>The number of vehicles in your fleet.</p>
					</div>
				</div>

				<!-- Vehicle Capacity  -->
				<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
					<!-- Input -->
					<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
						<label class="label" for="vehicle-capacity">
							<span class="label-text">Vehicle Capacity</span>
						</label>
						<input
							type="text"
							class="input input-bordered w-full"
							id="vehicle-capacity"
							bind:value={_vehicleCapacity} />
						<label class="label" for="vehicle-capacity">
							<span class="label-text text-gray-500"> Provide a non-negative integer. </span>
						</label>
					</div>

					<div class="divider lg:divider-horizontal" />

					<!-- Description -->
					<div class="max-w-md">
						<p>Unit capacity of each vehicle.</p>
					</div>
				</div>

				{#if showAdvancedParameters}
					<!-- Ignored Customers  -->
					<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
						<!-- Input -->
						<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
							<label class="label" for="ignored-customers">
								<span class="label-text">Ignored Customers</span>
							</label>
							<input
								type="text"
								class="input input-bordered w-full"
								id="ignored-customers"
								bind:value={_ignoredCustomers} />
							<label class="label" for="ignored-customers">
								<span class="label-text text-gray-500">
									Provide a list of comma separated non-negative integers representing the customer (location) ids.
								</span>
							</label>
						</div>

						<div class="divider lg:divider-horizontal" />

						<!-- Description -->
						<div class="max-w-md">
							<p>
								Customers to be ignored even though they are included in the selected location set. Relevant if a
								customer cannot be served or cancelled for the day.
							</p>
						</div>
					</div>

					<!-- Completed Customers  -->
					<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
						<!-- Input -->
						<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
							<label class="label" for="completed-customers">
								<span class="label-text">Completed Customers</span>
							</label>
							<input
								type="text"
								class="input input-bordered w-full"
								id="completed-customers"
								bind:value={_completedCustomers} />
							<label class="label" for="completed-customers">
								<span class="label-text text-gray-500">
									Provide a list of comma separated non-negative integers representing the customer (location) ids.
								</span>
							</label>
						</div>

						<div class="divider lg:divider-horizontal" />

						<!-- Description -->
						<div class="max-w-md">
							<p>
								Customers to be ignored from the selected location set because they were already completed. Relevant for
								VRP refinement calls.
							</p>
						</div>
					</div>

					<!-- Start Times of Vehicles -->
					<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
						<!-- Input -->
						<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
							<label class="label" for="start-times">
								<span class="label-text">Start Times of Vehicles</span>
							</label>
							<input
								type="text"
								class="input input-bordered w-full"
								id="start-times"
								bind:value={_startTimesOfVehicles} />
							<label class="label" for="duration-select">
								<span class="label-text text-gray-500">
									Provide a list of comma separated non-negative integers representing seconds after shift start.
								</span>
							</label>
						</div>

						<div class="divider lg:divider-horizontal" />

						<!-- Description -->
						<div class="max-w-md">
							<p>The closest availability times of the vehicles at the warehouse. Relevant for VRP refinement calls.</p>
						</div>
					</div>
				{/if}

				<!-- Advanced Parameters Button -->
				<div class="flex flex-row place-content-end justify-items-end">
					<div>
						<button
							class="btn btn-ghost"
							on:click={() => {
								showAdvancedParameters = !showAdvancedParameters;
							}}>
							{showAdvancedParameters ? 'Hide' : 'Show'} Advanced Parameters
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="p-2" />

		<!-- Algorithm Card-->
		<div class="card bg-base-200 w-full text-neutral-content">
			<div class="card-body">
				<!-- Algorithm Card Title -->
				<div id="title" class="text-3xl font-bold pb-4">Solvers</div>

				<!-- Algorithm Options -->

				<div class="collapse bg-base-200">
					<input type="checkbox" />
					<div class="collapse-title text-xl font-medium">Ant Colony Optimization</div>
					<div class="collapse-content">
						<!-- [ACO] -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<!-- Input -->
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="aco_nHyperparams">
									<span class="label-text">Number of Hyperparameters</span>
								</label>
								<input
									type="text"
									class="input input-bordered w-full"
									id="aco_rangeNIterations"
									bind:value={aco_nHyperparams} />
								<label class="label" for="aco_nHyperparams">
									<span class="label-text text-gray-500"> Provide a non-negative integer. </span>
								</label>
							</div>
						</div>

						<!-- [ACO] -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="aco_considerDepots">
									<span class="label-text">Consider Depots</span>
								</label>
								<select class="select select-bordered" id="aco_considerDepots" bind:value={aco_considerDepots}>
									<option value={false} selected>False</option>
									<option value={true}>True</option>
								</select>
							</div>
						</div>

						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="aco_solver">
									<span class="label-text">Algorithm Variant </span>
								</label>
								<select class="select select-bordered" id="aco_solver" bind:value={aco_solver}>
									<option value={'ACO_VRP_1'}>ACO_VRP_1</option>
									<option value={'ACO_VRP_2'} selected>ACO_VRP_2</option>
								</select>
							</div>
						</div>

						<!-- [ACO] -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="aco_pheromoneUseFirstHour">
									<span class="label-text">Pheromone Use First Hour</span>
								</label>
								<select
									class="select select-bordered"
									id="aco_pheromoneUseFirstHour"
									bind:value={aco_pheromoneUseFirstHour}>
									<option value={false} selected>False</option>
									<option value={true} disabled>True</option>
								</select>
							</div>
						</div>

						<!-- [ACO] -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<!-- Input -->
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="aco_rangeNIterationst">
									<span class="label-text">Range N Iterations</span>
								</label>
								<input
									type="text"
									class="input input-bordered w-full"
									id="aco_rangeNIterations"
									bind:value={aco_rangeNIterations} />
								<label class="label" for="aco_rangeNIterations">
									<span class="label-text text-gray-500"> Provide two comma separated integers. </span>
								</label>
							</div>
						</div>

						<!-- [ACO] -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<!-- Input -->
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="aco_rangeNSubIterations">
									<span class="label-text">Range N Subiterations</span>
								</label>
								<input
									type="text"
									class="input input-bordered w-full"
									id="aco_rangeNSubIterations"
									bind:value={aco_rangeNSubIterations} />
								<label class="label" for="aco_rangeNSubIterations">
									<span class="label-text text-gray-500"> Provide two comma separated integers. </span>
								</label>
							</div>
						</div>

						<!-- [ACO] -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<!-- Input -->
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="aco_rangeQ">
									<span class="label-text">Range Q</span>
								</label>
								<input type="text" class="input input-bordered w-full" id="aco_rangeQ" bind:value={aco_rangeQ} />
								<label class="label" for="aco_rangeQ">
									<span class="label-text text-gray-500"> Provide two comma separated integers. </span>
								</label>
							</div>
						</div>

						<!-- [ACO] -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<!-- Input -->
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="aco_rangeAlpha">
									<span class="label-text">Range Alpha</span>
								</label>
								<input
									type="text"
									class="input input-bordered w-full"
									id="aco_rangeAlpha"
									bind:value={aco_rangeAlpha} />
								<label class="label" for="aco_rangeAlpha">
									<span class="label-text text-gray-500"> Provide two comma separated integers. </span>
								</label>
							</div>
						</div>

						<!-- [ACO] -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<!-- Input -->
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="aco_rangeBeta">
									<span class="label-text">Range Beta</span>
								</label>
								<input type="text" class="input input-bordered w-full" id="aco_rangeBeta" bind:value={aco_rangeBeta} />
								<label class="label" for="aco_rangeBeta">
									<span class="label-text text-gray-500"> Provide two comma separated integers. </span>
								</label>
							</div>
						</div>

						<!-- [ACO] -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<!-- Input -->
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="aco_rangeRho">
									<span class="label-text">Range Rho</span>
								</label>
								<input type="text" class="input input-bordered w-full" id="aco_rangeRho" bind:value={aco_rangeRho} />
								<label class="label" for="aco_rangeRho">
									<span class="label-text text-gray-500"> Provide two comma separated floats. </span>
								</label>
							</div>
						</div>
					</div>
				</div>

				<div class="collapse bg-base-200">
					<input type="checkbox" />
					<div class="collapse-title text-xl font-medium">Genetic Algorithm</div>
					<div class="collapse-content">
						<!-- [GA] Multi-threaded Selection -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="locations-dropdown">
									<span class="label-text">Multi-threaded</span>
								</label>
								<select class="select select-bordered" id="locations-dropdown" bind:value={ga_multiThreaded}>
									<option value={false} selected>False</option>
									<option value={true}>True</option>
								</select>
							</div>
						</div>

						<!-- [GA] Iteration Count -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<!-- Input -->
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="ga-iter-count">
									<span class="label-text">Iteration Count</span>
								</label>
								<input
									type="text"
									class="input input-bordered w-full"
									id="ga-iter-count"
									bind:value={ga_iterationCount} />
								<label class="label" for="ga-iter-count">
									<span class="label-text text-gray-500"> Provide a non-negative integer. </span>
								</label>
							</div>
						</div>

						<!-- [GA] Random Permutation Count -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<!-- Input -->
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="ga-random-count">
									<span class="label-text">Random Permutation Count</span>
								</label>
								<input
									type="text"
									class="input input-bordered w-full"
									id="ga-random-count"
									bind:value={ga_randomPermutationCount} />
								<label class="label" for="ga-random-count">
									<span class="label-text text-gray-500"> Provide a non-negative integer. </span>
								</label>
							</div>
						</div>

						<!-- [GA] -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<!-- Input -->
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="ga_maxK">
									<span class="label-text">Max K</span>
								</label>
								<input type="text" class="input input-bordered w-full" id="ga_maxK" bind:value={ga_maxK} />
								<label class="label" for="ga_maxK">
									<span class="label-text text-gray-500"> Provide a positive integer or -1. </span>
								</label>
							</div>
						</div>

						<!-- [GA] -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="locations-dropdown">
									<span class="label-text">K Lower Limit</span>
								</label>
								<select class="select select-bordered" id="locations-dropdown" bind:value={ga_kLowerLimit}>
									<option value={false}>False</option>
									<option value={true} selected>True</option>
								</select>
							</div>
						</div>
					</div>
				</div>

				<div class="collapse bg-base-200">
					<input type="checkbox" />
					<div class="collapse-title text-xl font-medium">Simulated Annealing</div>
					<div class="collapse-content">
						<!-- [SA] Iteration Count -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<!-- Input -->
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="sa-iter-count">
									<span class="label-text">Iteration Count</span>
								</label>
								<input
									type="text"
									class="input input-bordered w-full"
									id="sa-iter-count"
									bind:value={sa_iterationCount} />
								<label class="label" for="sa-iter-count">
									<span class="label-text text-gray-500"> Provide a non-negative integer. </span>
								</label>
							</div>
						</div>

						<!-- [SA] Initial Temperature -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<!-- Input -->
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="sa-initial-temperature">
									<span class="label-text">Initial Temperature</span>
								</label>
								<input
									type="text"
									class="input input-bordered w-full"
									id="sa-initial-temperature"
									bind:value={sa_initialTemperature} />
								<label class="label" for="sa-initial-temperature">
									<span class="label-text text-gray-500"> Provide a non-negative integer. </span>
								</label>
							</div>
						</div>

						<!-- [SA] Cooldown Factor -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<!-- Input -->
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="sa-slowdown-factor">
									<span class="label-text">Slowdown Factor</span>
								</label>
								<input
									type="text"
									class="input input-bordered w-full"
									id="sa-slowdown-factor"
									bind:value={sa_slowdownFactor} />
								<label class="label" for="sa-slowdown-factor">
									<span class="label-text text-gray-500"> Provide a non-negative integer. </span>
								</label>
							</div>
						</div>

						<!-- [SA] Slowdown Factor -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<!-- Input -->
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="sa-cooldown-factor">
									<span class="label-text">Cooldown Factor</span>
								</label>
								<input
									type="text"
									class="input input-bordered w-full"
									id="sa-cooldown-factor"
									bind:value={sa_cooldownFactor} />
								<label class="label" for="sa-cooldown-factor">
									<span class="label-text text-gray-500"> Provide a non-negative integer. </span>
								</label>
							</div>
						</div>

						<!-- [SA] max cycles  -->
						<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
							<!-- Input -->
							<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
								<label class="label" for="sa_max_cycles">
									<span class="label-text">Max Cycles</span>
								</label>
								<input
									type="text"
									class="input input-bordered w-full"
									id="sa_max_cycles"
									bind:value={sa_max_cycles} />
								<label class="label" for="sa_max_cycles">
									<span class="label-text text-gray-500"> Provide a non-negative integer. </span>
								</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="p-2" />

		<!-- Result Card -->
		<div class="card bg-base-200 w-full text-neutral-content">
			<div class="card-body">
				<div id="title" class="text-3xl font-bold pb-4">Results</div>

				{#if !session}
					<div class="flex flex-col items-center">
						<div class="pb-4"><LockIcon --height="3rem" --width="3rem" /></div>
						<div class="pb-4 text-center">
							<p>You need to login or register before you can use the solvers.</p>
							<p>However, you can still work with the public solutions saved in the database.</p>
						</div>
						<div>
							<button class="btn btn-primary" on:click={() => ($loginModalOpen = true)}>Login</button>
							<button class="btn btn-disabled">Register</button>
						</div>
					</div>

					<div class="flex flex-row place-content-end justify-items-end" />
				{:else if session && !waitingResponse && !receivedResponse}
					<!-- Result Descriptors -->
					<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
						<!-- Solution Name -- Input -->
						<div class="form-control" style="min-width: 28rem">
							<label class="label" for="solution-name">
								<span class="label-text">Solution Name</span>
							</label>
							<input type="text" class="input input-bordered w-full" id="solution-name" bind:value={solutionName} />
							<label class="label" for="solution-name">
								<span class="label-text text-gray-500"> Give a simple name to your solution to recognize it. </span>
							</label>
						</div>

						<div class="p-4" />

						<!-- Solution Description -- Input -->
						<div class="form-control" style="min-width: 28rem">
							<label class="label" for="solution-desc">
								<span class="label-text">Solution Description</span>
							</label>
							<input
								type="text"
								class="input input-bordered w-full"
								id="solution-desc"
								bind:value={solutionDescription} />
							<label class="label" for="solution-desc">
								<span class="label-text text-gray-500">
									<p>Provide a description for the solution.</p>
								</span>
							</label>
						</div>
					</div>

					<div class="flex flex-row place-content-end justify-items-end">
						<div>
							<button
								class="btn btn-secondary"
								on:click={() => {
									showApiCall = true;
								}}>
								Inspect API Call
							</button>
						</div>
						<div class="p-1" />
						<button class={`btn btn-primary`} on:click={solve}> Solve </button>
					</div>
				{:else if receivedResponse}
					<div class="overflow-x-auto">
						<table class="table">
							<!-- head -->
							<thead>
								<tr>
									<th>Algorithm</th>
									{#each aco_responses as _, i}
										<th>Run {i + 1}</th>
									{/each}
									<th>Best Result</th>
								</tr>
							</thead>
							<tbody>
								<!-- row 1 -->
								<tr>
									<td>Ant Colony Optimization</td>
									{#each aco_responses as response}
										<td>{parseInt(response?.data?.message?.durationMax) ?? '??'}</td>
									{/each}
									<td>
										{Math.min(
											...aco_responses
												.filter((x) => x?.data?.success)
												.map((x) => nonNegativeInt(x?.data?.message?.durationMax))
										)}
									</td>
								</tr>
								<!-- row 2 -->
								<tr>
									<td>Genetic Algorithm</td>
									{#each ga_responses as response}
										<td>{parseInt(response?.data?.message?.durationMax) ?? '??'}</td>
									{/each}
									<td>
										{Math.min(
											Infinity,
											...ga_responses
												.filter((x) => x?.data?.success)
												.map((x) => nonNegativeInt(x?.data?.message?.durationMax))
										)}
									</td>
								</tr>
								<!-- row 3 -->
								<tr>
									<td>Simulated Annealing</td>
									{#each sa_responses as response}
										<td>{parseInt(response?.data?.message?.durationMax) ?? '??'}</td>
									{/each}
									<td>
										{Math.min(
											Infinity,
											...sa_responses
												.filter((x) => x?.data?.success)
												.map((x) => nonNegativeInt(x?.data?.message?.durationMax))
										)}
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div class="flex flex-row place-content-end justify-items-end">
						<div>
							<button
								class="btn btn-secondary"
								on:click={() => {
									showApiCall = true;
								}}>
								Inspect API Call
							</button>
						</div>
						<div class="p-1" />
						<button class={`btn btn-primary`} on:click={solve}> Solve </button>
					</div>
				{/if}

				{#if waitingAco || waitingGa || waitingSa}
					<div transition:fade class="flex place-content-center">
						<div class="max-w-md">
							<progress class="progress min-w-md" />
							<div class="text-center pt-4">
								<div>Solving, this may take a minute or two...</div>
								<div>The result will be saved in the database.</div>
							</div>
						</div>
					</div>
				{/if}

				
			</div>
		</div>

		<!--

		<div class="p-2" />

		<div class="card bg-base-200 w-full text-neutral-content">
			<div class="card-body">
				<div id="title" class="text-3xl font-bold pb-4">Chart</div>

				




			</div>
		</div>
	-->
	</div>
</div>

<!--

		null,
		4
-->

<InspectApiModal
	request1="https://vrpms-main.vercel.app/api/vrp/aco"
	request2="https://vrpms-main.vercel.app/api/vrp/ga"
	request3="https://vrpms-main.vercel.app/api/vrp/sa"
	body1={
		{
					/* Common parameters */
					solutionName: '[ACO] ' + solutionName,
					solutionDescription,
					locationsKey,
					durationsKey,

					capacities: vehicleCapacities,
					startTimes: startTimesOfVehicles,
					ignoredCustomers,
					completedCustomers,
					auth: session?.access_token,

					/* Aco parameters */
					n_hyperparams: nonNegativeInt(aco_nHyperparams),
					consider_depots: aco_considerDepots,
					aco_sols: aco_solver,
					pheromone_uses_first_hour: aco_pheromoneUseFirstHour,
					range_n_iterations: aco_rangeNIterations ? aco_rangeNIterations.split(',').map((id) => parseFloat(id)) : [],
					range_n_sub_iterations: aco_rangeNSubIterations
						? aco_rangeNSubIterations.split(',').map((id) => nonNegativeInt(id))
						: [],
					range_q: aco_rangeQ ? aco_rangeQ.split(',').map((id) => nonNegativeInt(id)) : [],
					range_alpha: aco_rangeAlpha ? aco_rangeAlpha.split(',').map((id) => nonNegativeInt(id)) : [],
					range_beta: aco_rangeBeta ? aco_rangeBeta.split(',').map((id) => nonNegativeInt(id)) : [],
					range_rho: aco_rangeRho ? aco_rangeRho.split(',').map((id) => parseFloat(id)) : []
				}
	}
	body2={
		{
					/* Common parameters */
					solutionName: '[GA] ' + solutionName,
					solutionDescription,
					locationsKey,
					durationsKey,
					capacities: vehicleCapacities,
					startTimes: startTimesOfVehicles,
					ignoredCustomers,
					completedCustomers,
					auth: session?.access_token,

					/* GA parameters */
					multiThreaded: ga_multiThreaded,
					iterationCount: nonNegativeInt(ga_iterationCount),
					randomPermutationCount: nonNegativeInt(ga_randomPermutationCount),
					max_k: int(ga_maxK),
					k_lower_limit: ga_kLowerLimit
				}
	}
	body3={
		{
					/* Common parameters */
					solutionName: '[SA] ' + solutionName,
					solutionDescription,
					locationsKey,
					durationsKey,
					capacities: vehicleCapacities,
					startTimes: startTimesOfVehicles,
					ignoredCustomers,
					completedCustomers,
					auth: session?.access_token,

					/* SA parameters */
					cooldownFactor: nonNegativeInt(sa_cooldownFactor),
					slowdownMultiplier: nonNegativeInt(sa_slowdownFactor),
					totalIterations: nonNegativeInt(sa_iterationCount),
					initialTemperature: nonNegativeInt(sa_initialTemperature),
					maxCycles: 5
				}
	}
	bind:open={showApiCall} />
