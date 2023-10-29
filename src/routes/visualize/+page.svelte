<script lang="ts">
	import type { LatLngTuple } from 'leaflet';
	import Leaflet from '../../lib/components/leaflet/Leaflet.svelte';
	import Marker from '../../lib/components/leaflet/Marker.svelte';
	import Popup from '../../lib/components/leaflet/Popup.svelte';
	import Polyline from '../../lib/components/leaflet/Polyline.svelte';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import MapMarker from '../../lib/svg/MapMarker.svelte';
	import VehicleMarker from '$lib/components/leaflet/VehicleMarker.svelte';
	import { Simulator } from './simulator';
	import PlayIcon from '$lib/svg/PlayIcon.svelte';
	import PauseIcon from '$lib/svg/PauseIcon.svelte';
	import PlayerMenu from './PlayerMenu.svelte';
	import { page } from '$app/stores';
	import type { Db } from '$lib/database/queries/query';
	import type { My } from '../types';

	/* ================ DATA ==================== */

	let solutions: My.AlgorithmSolution[] = [];
	let locationSets: My.LocationSet[] = [];


	let selectedLocationSetIdx = 0;
	let selectedSolutionIdx = 0;

	let selectedLocationSet: My.LocationSet | null = null;
	let selectedSolution: My.AlgorithmSolution | null = null;

	$: selectedLocationSet = locationSets[selectedLocationSetIdx] ?? null;
	$: selectedSolution = solutions[selectedSolutionIdx] ?? null;

	async function loadData() {
		const query = $page.data.query;

		(async () => {
			const saved1: Db.SolutionRecord[] = await query.solutions.all();
			const saved2: Db.LocationSet[] = await query.locations.all();
			solutions = saved1.map((x) => x.json as My.AlgorithmSolution);
			locationSets = saved2.map((e) => e.json as My.LocationSet);
		})();

		(async () => {
			
		})();
	}

	onMount(() => {
		loadData();
	});

	$: selectedSolution,
		(() => {
			console.log('selectedSolution', selectedSolution);
		})();

	/* ================ MAP RELATED ====================== */

	const initialView: LatLngTuple = [48.137154, 11.576124];

	let markerLocations: Array<LatLngTuple>;
	$: markerLocations = selectedLocationSet?.map((loc) => [loc[0] as number, loc[1] as number]) ?? [];

	const getLatLngs = (idxs: number[], lookup: any[]) => {
		return idxs.map((idx) => {
			const lat = lookup[idx][0];
			const lng = lookup[idx][1];
			return [lat, lng] as LatLngTuple
		});
	}

	function randomColor() {
		const random = Math.floor(Math.random() * 10);
		const hue = random * 137.508; // use golden angle approximation
		return `hsl(${hue}, 50%, 75%)`;
	}

	let waypoints: LatLngTuple[] | undefined;
	let arrivals: number[] | undefined ;
	let finishTime: number;

	// ONLY FOR FIRST CAR
	// Flatten the solution and arrivals array
	$: {
		waypoints = selectedSolution?.solution?.[0]?.flatMap((tour) => tour).map((i) => markerLocations[i]);
		arrivals = selectedSolution?.arrivals?.[0]?.flatMap((t) => t);
		finishTime = arrivals?.[arrivals?.length - 1] ?? 0;
	}
	


	let sliderPercentage: number = 0;
	$: currentTime = (sliderPercentage / 100) * finishTime;

	let simulator: Simulator;
	$: simulator = new Simulator(waypoints, arrivals);

	let vehiclePosition: LatLngTuple;
	$: vehiclePosition = simulator.getPosition(currentTime);

	$: colors = selectedSolution?.solution?.[0]?.map(() => randomColor()) ?? [];

	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	let isPlayerMenuOpen = false;
	let isPlaying = false;

	async function play() {
		if (sliderPercentage == 100) {
			sliderPercentage = 0;
		}
		while (sliderPercentage < 100 && isPlaying) {
			sliderPercentage += 1;
			await sleep(500);
		}
		isPlaying = false;
	}
</script>

<div class="w-full" style={'height: calc(100vh - 4rem - 5rem)'}>
	<Leaflet view={initialView} zoom={12}>
		{#each markerLocations as latLng, i}
			<Marker {latLng}>
				<MapMarker />
				<Popup>{selectedLocationSet?.[i][2]} ({i})</Popup>
			</Marker>
		{/each}

		<VehicleMarker latLng={vehiclePosition}>
			<img src="/images/iso-truck.png" alt="truck" style="margin-top: -20px; margin-left: -10px" />
		</VehicleMarker>

		{#if selectedSolution}
			{#each selectedSolution.solution as multiTour, vehicleIdx}
				{#each multiTour as tour, tourIdx}
					<Polyline
						latLngs={getLatLngs(tour, markerLocations)}
						color={colors[vehicleIdx]}
						popup={`Tour ${tourIdx + 1} of Vehicle ${vehicleIdx + 1}`} />
				{/each}
			{/each}
		{/if}
	</Leaflet>
</div>

<PlayerMenu bind:open={isPlayerMenuOpen} />

<div class="flex flex-row items-center place-content-equal w-full">
	<div class="form-control p-4" style="width: 14rem;">
		<select class="select select-bordered">
			<option selected>Initial Plan</option>
			<option>Event - 12:00</option>
			<option>Event - 14:00</option>
			<option>Event - 17:30</option>
		</select>
	</div>

	<div class="p2">
		{#if isPlaying}
			<button class="btn btn-ghost" on:click={() => (isPlaying = false)}>
				<PauseIcon />
			</button>
		{:else}
			<button
				class="btn btn-ghost"
				on:click={() => {
					isPlaying = true;
					play();
				}}>
				<PlayIcon />
			</button>
		{/if}
	</div>

	<div class="p-2">
		<a class="text-3xl text-bold">08:00</a>
	</div>

	<div class="p-2" style="width: 100%; margin-top: .3rem">
		<input type="range" min="0" max="100" bind:value={sliderPercentage} class="range w-full" />
	</div>

	<div class="p-2">
		<a class="text-3xl text-bold">16:00</a>
	</div>

	<div style="margin-left: auto;" on:click={() => (isPlayerMenuOpen = true)}>
		<button class="btn btn-ghost">Menu</button>
	</div>
</div>
