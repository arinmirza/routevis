<script lang="ts">
	import BoltIcon from "$lib/svg/BoltIcon.svelte";
	import Cog6 from "$lib/svg/Cog6.svelte";
import PauseIcon from "$lib/svg/PauseIcon.svelte";
	import PlayForward from "$lib/svg/PlayForward.svelte";
	import PlayIcon from "$lib/svg/PlayIcon.svelte";
	import type { Solution } from "$lib/types/map";
	import VisualizerMenu from "./VisualizerMenu.svelte";
	import dayjs from 'dayjs';


    export let solutions: Solution[];
    export let selectedSolutionId: number | null;
    export let currentTime: number;
	export let visualize: boolean;


	/* ==============  Derived data from the selected solution ================ */
	let selectedSolution: Solution | undefined;
	let finishTimes: number[] | undefined;
	let latestFinishTime: number;
	
	$: selectedSolution = solutions.find(sol => sol.id == selectedSolutionId);
	$: finishTimes = selectedSolution?.vehicles.map(vehicle => {
		const lastTour = vehicle.tours[vehicle.tours.length - 1];
		const lastStop = lastTour[lastTour.length - 1];
		return lastStop.arrivalTime;
	});
	$: latestFinishTime = finishTimes ? Math.max(...finishTimes) : 0;
	const dayStart = dayjs().set('hour', 8).set('minute', 0).set('second', 0);
	$: dayEnd = dayStart.add(latestFinishTime, 'seconds');
	
    
	/* ============  Visualizer Player  ============== */
    let isPlaying: boolean = false;
    let isMenuOpen: boolean = false;
    let sliderPercentage: number = 0;

	$: sliderPercentage, setCurrentTime(sliderPercentage);

	function setCurrentTime(sliderPercentage: number) {
		currentTime = (sliderPercentage / 100) * latestFinishTime;
	}

    function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

    async function play() {
		// Reset the slider percentage if completed
        if (sliderPercentage == 100) {
			sliderPercentage = 0;
		}

        // Slowly increase the slider percentage while playing
		while (sliderPercentage < 100 && isPlaying) {
			sliderPercentage += 1;
			await sleep(500);
		}

        // Stop the slider increase
		isPlaying = false;
	}


</script>

<VisualizerMenu bind:open={isMenuOpen} />

<div class="flex flex-row items-center place-content-equal w-full pt-2">


	<!--
	<div class="pl-2">
		<button class="btn btn-ghost">
			<div class="flex flex-row items-end">
				<BoltIcon />
				<div>×2</div>
				
			</div>
		</button>
	</div>
	-->

	<div class="p-2">
		{#if isPlaying}
			<button class="btn btn-ghost" on:click={() => { isPlaying = false; }}>
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
		<p class="text-3xl text-bold">08:00</p>
	</div>

	<div class="p-2" style="width: 100%; margin-top: .3rem">
		<input type="range" min="0" max="100" bind:value={sliderPercentage} class="range w-full" />
	</div>

	<div class="p-2">
		<p class="text-3xl text-bold">{dayEnd.format("HH:mm")}</p>
	</div>

	<div style="margin-left: auto;">
		<button class="btn btn-ghost" on:click={() => {
			selectedSolutionId = null;
			visualize = false;
			}}>Menu</button>
	</div>
</div>