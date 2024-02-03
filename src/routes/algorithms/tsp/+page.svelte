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
	let showApiCall = false;
	let loadingLocations = false;
	let loadingDurations = false;

	/* Algorithm Selection */
	let selectedAlgorithm: 'sa' | 'ga' | 'aco' | null = null;

	/* Technical variables */
	let waitingResponse = false;
	let receivedResponse = false;
	let response: any;

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
	let customers = '';
	let startNode = '';
	let startTime = '';
	let doLoadingUnloading = true;
	let cancelledCustomers = '';

	/* Solution Describers */
	let solutionName: string = '';
	let solutionDescription: string = '';

	/* Ant Colony Optimization Parameters */
	let aco_solver = 'ACO_TSP_2';
	let aco_nHyperparams = '3';
	let aco_pheromoneUseFirstHour = false;
	let aco_rangeNIterations = '25, 50';
	let aco_rangeNSubIterations = '5, 10';
	let aco_rangeQ = '1, 1000';
	let aco_rangeAlpha = '2, 5';
	let aco_rangeBeta = '2, 5';
	let aco_rangeRho = '0.8, 1';

	/* Genetic Algorithm Parametes */
	let ga_multiThreaded: boolean = false;
	let ga_randomPermutationCount: string = '100';
	let ga_iterationCount: string = '10';
	let ga_kLowerLimit = true;
	let ga_maxK = '-1';

	/* Simulated Annealing Parameters */
	let sa_threshold = '10';
	let sa_nIterations = '100';
	let sa_alpha = '0.1';
	let sa_cooling = '0.9';
	let sa_init = 'nearest_neighbor';
	let sa_termination = 'max_steps';
	let sa_neighborhood = '2-opt';

	$: requestEndpoint = getEndpoint(selectedAlgorithm);

	function getEndpoint(selected: string | null) {
		console.log('getendpoint', selected);
		switch (selected) {
			case 'ga':
				return 'https://vrpms-rpke.vercel.app/api/tsp/ga';
			case 'aco':
				return 'https://vrpms-git-metehan-aco-mefarnis-projects.vercel.app/api/tsp/aco';
			case 'sa':
				return 'https://vrpms-git-metehan-aco-mefarnis-projects.vercel.app/api/tsp/sa';
		}
		return '<ENDPOINT>';
	}

	async function solve() {
		console.log('Sending request to endpoint:', requestEndpoint);

		waitingResponse = true;

		try {
			response = await axios.post(
				requestEndpoint,
				{
					/* Common parameters */
					solutionName,
					solutionDescription,
					locationsKey,
					durationsKey,
                    customers: customers ? customers.split(',').map((id) => nonNegativeInt(id)) : [],
					startTime: nonNegativeInt(startTime),
                    startNode: nonNegativeInt(startNode),
                    do_loading_unloading: doLoadingUnloading,
                    cancel_customers: cancelledCustomers ? cancelledCustomers.split(',').map((id) => nonNegativeInt(id)) : [],
					auth: session?.access_token,

					/* Algorithm specific parameters */
					...(selectedAlgorithm === 'ga' && {
						multiThreaded: ga_multiThreaded,
						iterationCount: nonNegativeInt(ga_iterationCount),
						randomPermutationCount: nonNegativeInt(ga_randomPermutationCount),
						max_k: int(ga_maxK),
						k_lower_limit: ga_kLowerLimit,
					}),
					...(selectedAlgorithm === 'aco' && {
						n_hyperparams: nonNegativeInt(aco_nHyperparams),
						aco_sols: aco_solver,
						pheromone_uses_first_hour: aco_pheromoneUseFirstHour,
						range_n_iterations: aco_rangeNIterations ? aco_rangeNIterations.split(',').map((id) => parseFloat(id)) : [],
						range_n_sub_iterations: aco_rangeNSubIterations ? aco_rangeNSubIterations.split(',').map((id) => nonNegativeInt(id)) : [],
						range_q: aco_rangeQ ? aco_rangeQ.split(',').map((id) => nonNegativeInt(id)) : [],
						range_alpha: aco_rangeAlpha ? aco_rangeAlpha.split(',').map((id) => nonNegativeInt(id)) : [],
						range_beta: aco_rangeBeta ? aco_rangeBeta.split(',').map((id) => nonNegativeInt(id)) : [],
						range_rho: aco_rangeRho ? aco_rangeRho.split(',').map((id) => parseFloat(id)) : [],
					}),
					...(selectedAlgorithm === 'sa' && {
						threshold: nonNegativeInt(sa_threshold),
						n_iterations: nonNegativeInt(sa_nIterations),
						alpha: parseFloat(sa_alpha), 
						cooling: parseFloat(sa_cooling),
						init: sa_init,
						termination: sa_termination,
						neighborhood: sa_neighborhood,
					})
				},
				{
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		} catch {
			response = { error: 'Invalid request.' };
		}

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
		<div id="title" class="text-4xl font-bold pb-8 text-center">TSP</div>

		<!-- Scenario Card -->
		<div class="card bg-base-200 w-full text-neutral-content">
			<div class="card-body">
				<!-- Scenario Card Title -->
				<div class="flex flex-row items-center">
					<div id="title" class="text-3xl font-bold pb-4">Scenario</div>
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

				<!-- TSP Customers  -->
				<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
					<!-- Input -->
					<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
						<label class="label" for="customers">
							<span class="label-text">Customers</span>
						</label>
						<input type="text" class="input input-bordered w-full" id="customers" bind:value={customers} />
						<label class="label" for="customers">
							<span class="label-text text-gray-500"> Provide a list of comma separated non-negative integers. </span>
						</label>
					</div>

					<div class="divider lg:divider-horizontal" />

					<!-- Description -->
					<div class="max-w-md">
						<p>These customers will be considered in the TSP calculation.</p>
					</div>
				</div>

				<!-- TSP Start Node  -->
				<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
					<!-- Input -->
					<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
						<label class="label" for="start-node">
							<span class="label-text">Starting Node</span>
						</label>
						<input type="text" class="input input-bordered w-full" id="start-node" bind:value={startNode} />
						<label class="label" for="start-node">
							<span class="label-text text-gray-500"> Provide a non-negative integer. </span>
						</label>
					</div>

					<div class="divider lg:divider-horizontal" />

					<!-- Description -->
					<div class="max-w-md">
						<p>The vehicle will start the tour at this location.</p>
					</div>
				</div>

				<!-- TSP Start Time  -->
				<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
					<!-- Input -->
					<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
						<label class="label" for="start-time">
							<span class="label-text">Starting Time</span>
						</label>
						<input type="text" class="input input-bordered w-full" id="start-time" bind:value={startTime} />
						<label class="label" for="start-time">
							<span class="label-text text-gray-500"> Provide a non-negative integer (seconds from day start). </span>
						</label>
					</div>

					<div class="divider lg:divider-horizontal" />

					<!-- Description -->
					<div class="max-w-md">
						<p>The vehicle will start the tour at this time.</p>
					</div>
				</div>

				{#if showAdvancedParameters}
					<!-- Cancelled Customers  -->
					<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
						<!-- Input -->
						<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
							<label class="label" for="cancelled-customers">
								<span class="label-text">Cancelled Customers</span>
							</label>
							<input
								type="text"
								class="input input-bordered w-full"
								id="cancelled-customers"
								bind:value={cancelledCustomers} />
							<label class="label" for="cancelled-customers">
								<span class="label-text text-gray-500">
									Provide a list of comma separated non-negative integers representing the customer (location) ids.
								</span>
							</label>
						</div>

						<div class="divider lg:divider-horizontal" />

						<!-- Description -->
						<div class="max-w-md">
							<p>
								The list of cancelled customers whose demands were already loaded into the vehicle. Hence their demands
								must be considered in unloading times.
							</p>
						</div>
					</div>

					<!-- TSP Loading Unloading  -->

					<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
						<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
							<label class="label" for="load-unload">
								<span class="label-text">Consider Load/Unload Times</span>
							</label>
							<select class="select select-bordered" id="load-unload" bind:value={doLoadingUnloading}>
								<option value={true} selected>True</option>
								<option value={false}>False</option>
							</select>
						</div>

						<div class="divider lg:divider-horizontal" />

						<!-- Description -->
						<div class="max-w-md">
							<p>Consider the loading/unloading times of the supplies into/from the vehicle.</p>
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
				<div id="title" class="text-3xl font-bold pb-4">Solver</div>

				<!-- Algorithm Selection  -->

				<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
					<div class="form-control" style="min-width: 28rem;">
						<label class="label" for="locations-dropdown">
							<span class="label-text">Algorithm</span>
						</label>
						<select class="select select-bordered" id="locations-dropdown" bind:value={selectedAlgorithm}>
							<option value={null} disabled selected>Select a TSP solver</option>
							<option value="aco">Ant Colony Optimization</option>
							<option value="ga">Genetic Algorithm</option>
							<option value="sa">Simulated Annealing</option>
						</select>
					</div>

					<div class="divider lg:divider-horizontal" />
					<div class="max-w-md">
						<p>Algorithm to solve the time-dependent travelling salesman problem.</p>
					</div>
				</div>

				<!-- Algorithm Options -->

				{#if selectedAlgorithm === 'ga' && showMetaParameters}
					<!-- [GA] Multi-threaded Selection -->
					<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
						<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
							<label class="label" for="locations-dropdown">
								<span class="label-text">Multi-threaded</span>
							</label>
							<select class="select select-bordered" id="locations-dropdown" bind:value={ga_multiThreaded}>
								<option value={false} selected>False</option>
								<option value={true} disabled>True</option>
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
								<input
									type="text"
									class="input input-bordered w-full"
									id="ga_maxK"
									bind:value={ga_maxK} />
								<label class="label" for="ga_maxK">
									<span class="label-text text-gray-500"> Provide a (possibly negative) integer. </span>
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
				{/if}

				{#if selectedAlgorithm === 'sa' && showMetaParameters}
					<!-- [SA] -->
					<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
						<!-- Input -->
						<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
							<label class="label" for="sa_nIterations">
								<span class="label-text">Iteration Count</span>
							</label>
							<input
								type="text"
								class="input input-bordered w-full"
								id="sa_nIterations"
								bind:value={sa_nIterations} />
							<label class="label" for="sa_nIterations">
								<span class="label-text text-gray-500"> Provide a non-negative integer. </span>
							</label>
						</div>
					</div>

					<!-- [SA] -->
					<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
						<!-- Input -->
						<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
							<label class="label" for="sa_threshold">
								<span class="label-text">Threshold</span>
							</label>
							<input
								type="text"
								class="input input-bordered w-full"
								id="sa_threshold"
								bind:value={sa_threshold} />
							<label class="label" for="sa_threshold">
								<span class="label-text text-gray-500"> Provide a non-negative integer. </span>
							</label>
						</div>
					</div>

					<!-- [SA] -->
					<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
						<!-- Input -->
						<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
							<label class="label" for="sa_alpha">
								<span class="label-text">Alpha</span>
							</label>
							<input
								type="text"
								class="input input-bordered w-full"
								id="sa_alpha"
								bind:value={sa_alpha} />
							<label class="label" for="sa_threshold">
								<span class="label-text text-gray-500"> Provide a non-negative float. </span>
							</label>
						</div>
					</div>

					<!-- [SA] -->
					<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
						<!-- Input -->
						<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
							<label class="label" for="sa_cooling">
								<span class="label-text">Cooling Factor</span>
							</label>
							<input
								type="text"
								class="input input-bordered w-full"
								id="sa_cooling"
								bind:value={sa_cooling} />
							<label class="label" for="sa_cooling">
								<span class="label-text text-gray-500"> Provide a non-negative float. </span>
							</label>
						</div>
					</div>

					<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
						<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
							<label class="label" for="sa_init">
								<span class="label-text">Initial Solution Strategy
								</span>
							</label>
							<select class="select select-bordered" id="sa_init" bind:value={sa_init}>
								<option value={"nearest_neighbor"} selected>Nearest Neighbor</option>
								<option value={'successive_insertion'} >Successive Insertion</option>
								<option value={'random'}>Random</option>
							</select>
						</div>
					</div>

					<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
						<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
							<label class="label" for="sa_termination">
								<span class="label-text">Termination Condition
								</span>
							</label>
							<select class="select select-bordered" id="sa_termination" bind:value={sa_termination}>
								<option value={"max_steps"} selected>Max Steps</option>
								<option value={'min_temp'}>Min Temperature</option>
							</select>
						</div>
					</div>

					<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
						<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
							<label class="label" for="sa_neighborhood">
								<span class="label-text">Neighborhood
								</span>
							</label>
							<select class="select select-bordered" id="sa_neighborhood" bind:value={sa_neighborhood}>
								<option value={"2-opt"} selected>2-Opt</option>
								<option value={'exchange'}>Exchange</option>
							</select>
						</div>
					</div>

				{/if}

				{#if selectedAlgorithm === 'aco' && showMetaParameters}

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

				<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
					<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
						<label class="label" for="aco_solver">
							<span class="label-text">Algorithm Variant
							</span>
						</label>
						<select class="select select-bordered" id="aco_solver" bind:value={aco_solver}>
							<option value={"ACO_TSP_1"} >ACO_TSP_1</option>
							<option value={'ACO_TSP_2'} selected>ACO_TSP_2</option>
						</select>
					</div>
				</div>
				
					<!-- [ACO] -->
					<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
						<div class="form-control" style="min-width: 28rem; max-width: 28rem;">
							<label class="label" for="aco_pheromoneUseFirstHour">
								<span class="label-text">Pheromone Use First Hour</span>
							</label>
							<select class="select select-bordered" id="aco_pheromoneUseFirstHour" bind:value={aco_pheromoneUseFirstHour}>
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
						<input type="text" class="input input-bordered w-full" id="aco_rangeNIterations" bind:value={aco_rangeNIterations} />
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
							<input type="text" class="input input-bordered w-full" id="aco_rangeNSubIterations" bind:value={aco_rangeNSubIterations} />
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
								<input type="text" class="input input-bordered w-full" id="aco_rangeAlpha" bind:value={aco_rangeAlpha} />
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

				{/if}

				<div class="flex flex-row place-content-end justify-items-end">
					<div>
						<button
							class="btn btn-ghost"
							on:click={() => {
								showMetaParameters = !showMetaParameters;
							}}>
							{showMetaParameters ? 'Hide' : 'Show'} Meta Parameters
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
					<div class="max-w-64 text-wrap">
						{#if response?.data?.success}
							<p>
								<b>Success!</b> A solution with <b>{response?.data?.message?.duration}</b> seconds of duration was found.
							</p>
							<p>
								The solution is saved under the name "<b>{solutionName}</b>" and can be displayed using the
								visualization tool.
							</p>
						{:else}
							<p><b>Something went wrong.</b> We are dumping the received response below.</p>
							<div class="max-w-64 text-wrap" style="max-width: 28rem;">
								<p>{JSON.stringify(response)}</p>
							</div>
						{/if}
					</div>
				{:else}
					<div transition:fade class="flex place-content-center">
						<div class="max-w-md">
							<progress class="progress min-w-md" />
							<div class="text-center pt-4">
								<div>Solving, this may take a minute or two...</div>
								<div>The result will be saved in the database.</div>
								<div>You can leave this page, or wait for the response.</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<InspectApiModal
	requestBody={JSON.stringify(
		{
					/* Common parameters */
					solutionName,
					solutionDescription,
					locationsKey,
					durationsKey,
                    customers: customers ? customers.split(',').map((id) => nonNegativeInt(id)) : [],
					startTime: nonNegativeInt(startTime),
                    startNode: nonNegativeInt(startNode),
                    do_loading_unloading: doLoadingUnloading,
                    cancel_customers: cancelledCustomers ? cancelledCustomers.split(',').map((id) => nonNegativeInt(id)) : [],
					auth: session?.access_token,

					/* Algorithm specific parameters */
					...(selectedAlgorithm === 'ga' && {
						multiThreaded: ga_multiThreaded,
						iterationCount: nonNegativeInt(ga_iterationCount),
						randomPermutationCount: nonNegativeInt(ga_randomPermutationCount),
						max_k: int(ga_maxK),
						k_lower_limit: ga_kLowerLimit,
					}),
					...(selectedAlgorithm === 'aco' && {
						n_hyperparams: nonNegativeInt(aco_nHyperparams),
						aco_sols: aco_solver,
						pheromone_uses_first_hour: aco_pheromoneUseFirstHour,
						range_n_iterations: aco_rangeNIterations ? aco_rangeNIterations.split(',').map((id) => parseFloat(id)) : [],
						range_n_sub_iterations: aco_rangeNSubIterations ? aco_rangeNSubIterations.split(',').map((id) => nonNegativeInt(id)) : [],
						range_q: aco_rangeQ ? aco_rangeQ.split(',').map((id) => nonNegativeInt(id)) : [],
						range_alpha: aco_rangeAlpha ? aco_rangeAlpha.split(',').map((id) => nonNegativeInt(id)) : [],
						range_beta: aco_rangeBeta ? aco_rangeBeta.split(',').map((id) => nonNegativeInt(id)) : [],
						range_rho: aco_rangeRho ? aco_rangeRho.split(',').map((id) => parseFloat(id)) : [],
					}),
					...(selectedAlgorithm === 'sa' && {
						threshold: nonNegativeInt(sa_threshold),
						n_iterations: nonNegativeInt(sa_nIterations),
						alpha: parseFloat(sa_alpha), 
						cooling: parseFloat(sa_cooling),
						init: sa_init,
						termination: sa_termination,
						neighborhood: sa_neighborhood,
					})
				},
		null,
		4
	)}
	endpoint={requestEndpoint}
	bind:open={showApiCall} />
