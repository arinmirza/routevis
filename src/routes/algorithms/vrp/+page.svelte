<script lang="ts">
	import { page } from '$app/stores';
	import LockIcon from '$lib/svg/LockIcon.svelte';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { PageData } from './$types';
	import type { DurationMatrix, LocationGroup, Solution } from '$lib/types/map';
	import axios from 'axios';
	import InspectApiModal from '$lib/components/debug/InspectAPIModal.svelte';

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

	/* Helper type definitions */
	type VehicleInput = { capacity: number; startTime: number };

	/* Helper methods */
	function nonNegativeInt(str: string) {
		const value = parseInt(str);
		return value && value >= 0 ? value : 0;
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
	$: ignoredCustomers = _ignoredCustomers.split(',').map((id) => nonNegativeInt(id));
	$: completedCustomers = _completedCustomers.split(',').map((id) => nonNegativeInt(id));
	$: startTimesOfVehicles = _startTimesOfVehicles.split(',').map((id) => nonNegativeInt(id));
	$: vehicleCapacities = Array(vehicleCount).fill(vehicleCapacity);

	/* Solution Describers */
	let solutionName: string = '';
	let solutionDescription: string = '';

	/* Simulated Annealing Parameters */
	let initialTemperature = 50;
	let cooldownFactor = 50;
	let iterationCount = 50;
	let terminateAfter = 50;
	let equalWorkIncentive = 50;

	/* Ant Colony Optimization Parameters */
	// TODO

	/* Genetic Algorithm Parametes */
	let gaMultiThreaded: boolean = false;
	let _gaRandomPermutationCount: string = '1000';
	let _gaIterationCount: string = '2000';
	$: gaRandomPermutationCount = nonNegativeInt(_gaRandomPermutationCount);
	$: gaIterationCount = nonNegativeInt(_gaIterationCount);

	/* Post Request Body */
	$: commonRequestBody = {
		solutionName,
		solutionDescription,
		locationsKey,
		durationsKey,
		capacities: vehicleCapacities,
		startTimes: startTimesOfVehicles,
		startTime: 0,
		ignoredCustomers,
		completedCustomers,
		auth: session?.access_token
	};

	$: specialRequestBody = getSpecialRequestBody(selectedAlgorithm);
	$: mergedRequestBody = { ...commonRequestBody, ...specialRequestBody };
	$: requestEndpoint = getEndpoint(selectedAlgorithm);

	function getSpecialRequestBody(selected: string | null) {
		if (selected === 'ga') {
			return {
				multiThreaded: gaMultiThreaded,
				iterationCount: gaIterationCount,
				randomPermutationCount: gaRandomPermutationCount
			};
		}
		return {};
	}

	function getEndpoint(selected: string | null) {
		if (selected === 'ga') {
			return 'https://vrpms-rpke.vercel.app/api/vrp/ga';
		}
		return '<ENDPOINT>';
	}

	function solve() {
		let auth = session?.access_token;
		axios.post(
			requestEndpoint,
			{
				solutionName,
				solutionDescription,
				locationsKey,
				durationsKey,
				capacities: vehicleCapacities,
				startTimes: startTimesOfVehicles,
				startNode: 0, // TODO: This needs to be removed
				iterationCount: gaIterationCount,
				randomPermutationCount: gaRandomPermutationCount,
				customers: [], // TODO: This needs to be removed
				ignoredCustomers,
				completedCustomers,
				auth
			},
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
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
			console.debug('durations:', locations);
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
						<select class="select select-bordered" id="duration-select">
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
				<div id="title" class="text-3xl font-bold pb-4">Solver</div>

				<!-- Algorithm Selection  -->

				<div class="flex flex-col w-full lg:flex-row pb-8 items-center">
					<div class="form-control" style="min-width: 28rem;">
						<label class="label" for="locations-dropdown">
							<span class="label-text">Algorithm</span>
						</label>
						<select class="select select-bordered" id="locations-dropdown" bind:value={selectedAlgorithm}>
							<option value={null} disabled selected>Select a VRP solver</option>
							<option value="aco" disabled>Ant Colony Optimization</option>
							<option value="ga">Genetic Algorithm</option>
							<option value="sa" disabled>Simulated Annealing</option>
						</select>
					</div>

					<div class="divider lg:divider-horizontal" />
					<div class="max-w-md">
						<p>Algorithm to solve the time-dependent multi-vehicle routing problem.</p>
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
							<select class="select select-bordered" id="locations-dropdown" bind:value={gaMultiThreaded}>
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
								bind:value={_gaIterationCount} />
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
								bind:value={_gaRandomPermutationCount} />
							<label class="label" for="ga-random-count">
								<span class="label-text text-gray-500"> Provide a non-negative integer. </span>
							</label>
						</div>
					</div>
				{/if}
				<!--
				{#if selectedAlgorithm === 'sa'}
					<SimulatedAnnealing bind:parameters={saParameters} showExplanations />
				{/if}
				-->

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
				{:else}
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
				{/if}
			</div>
		</div>
	</div>
</div>

<InspectApiModal
	requestBody={JSON.stringify(mergedRequestBody, null, 4)}
	endpoint={requestEndpoint}
	bind:open={showApiCall} />
