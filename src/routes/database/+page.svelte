<script lang="ts">
	import Map from '$lib/svg/Map.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import LocationsCard from './LocationsCard.svelte';
	import DurationsCard from './DurationsCard.svelte';
	import SolutionsCard from './SolutionsCard.svelte';
	import type { DurationMatrix, LocationGroup, Solution } from '$lib/types/map';
	import type { PageData } from './$types';

	export let data: PageData;
	const { query } = data;

	let locations: null | LocationGroup[] = null;
	let durations: null | DurationMatrix[] = null;
	let solutions: null | Solution[] = null;

	async function loadData() {
		(async () => {
			locations = await query.locations.all();
		})();
		(async () => {
			durations = await query.durations.all();
		})();
		(async () => {
			solutions = await query.solutions.all();
		})();
	}

	let fileInput: any = null;
	$: console.log('fileInput', fileInput);

	onMount(() => {
		loadData();
	});

	$: console.log(locations);
</script>

<div id="content-wrapper" class="p-9 flex flex-col content-center items-center">
	<div id="main-content" style="width: 80%">
		<div id="title" class="text-4xl font-bold pb-8 text-center">Saved Data</div>

		<LocationsCard bind:locations />

		<div class="p-4" />

		<DurationsCard bind:durations />

		<div class="p-4" />
		
		<SolutionsCard bind:solutions />
		
	</div>
</div>
