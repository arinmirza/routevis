<script lang="ts">
	import { page } from '$app/stores';
	import type { MapLocation, Solution } from '$lib/types/map';
	import { onMount } from 'svelte';
	import Visualizer from './Visualizer.svelte';
	import VisualizerControls from './VisualizerControls.svelte';
	import VisualizerSelection from './VisualizerSelection.svelte';


	// Solutions
	let solutions: Solution[] = [];

	let visualize = false;


	// Shared variables between components
	let currentTime: number = 0;
	let selectedSolutionId: number | null = null;
	$: selectedSolution = solutions.find(sol => sol.id == selectedSolutionId);
	

	// Data loading
	async function loadData() {
		solutions = await $page.data.query.solutions.all();
	}

	onMount(() => { loadData(); });



</script>

{#if visualize && selectedSolution}
	<Visualizer solution={selectedSolution} {currentTime} />
{:else}
	<VisualizerSelection {solutions} bind:selectedSolutionId bind:visualize/>
{/if}
<VisualizerControls {solutions} bind:selectedSolutionId bind:currentTime />