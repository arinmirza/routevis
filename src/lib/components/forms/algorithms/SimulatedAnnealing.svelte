<script lang="ts" context='module'>
    export type SimulatedAnnealingParameters = {
        initialTemperature: number;
	    cooldownFactor: number;
	    iterateFor: number;
	    terminationAfter: number;
	    equalWorkIncentive: number;
    }
</script>

<script lang="ts">
	import { fade } from 'svelte/transition';

    export let parameters: SimulatedAnnealingParameters;
	export let showExplanations = false;


	const temperatureOptions = { 0: 0, 25: 1000, 50: 2000, 75: 3000, 100: 4000 };
	const cooldownOptions = { 0: 0.6, 25: 0.7, 50: 0.8, 75: 0.9, 100: 0.95 };
	const iterateForOptions = { 0: 0, 25: 0, 50: 0, 75: 0, 100: 0 };
	const terminationAfterOptions = { 0: 0, 25: 0, 50: 0, 75: 0, 100: 0 };
	const equalWorkIncentiveOptions = { 0: 0, 25: 0, 50: 0, 75: 0, 100: 0 };

</script>

<div transition:fade>
	<!-- Initial Temperature-->
	<div class="flex flex-row w-full lg:flex-row pb-8 items-center">
		<div class="form-control" style="min-width: 28rem;">
			<label class="label" for="temperature">
				<span class="label-text">Initial Temperature</span>
			</label>
			<input
				type="range"
				min="0"
				max="100"
				bind:value={parameters.initialTemperature}
				class="range"
				step="25"
				name="temperature" />
			<div class="w-full flex justify-between text-xs px-2">
				<span>{temperatureOptions[0]}</span>
				<span>{temperatureOptions[25]}</span>
				<span>{temperatureOptions[50]}</span>
				<span>{temperatureOptions[75]}</span>
				<span>{temperatureOptions[100]}</span>
			</div>
		</div>
		{#if showExplanations}
			<div class="divider lg:divider-horizontal" />
			<div class="max-w-md">
				<p>The initial temperature</p>
			</div>{/if}
	</div>

	<!-- Cooldown Factor -->
	<div class="flex flex-row w-full lg:flex-row pb-8 items-center">
		<div class="form-control" style="min-width: 28rem;">
			<label class="label" for="cooldown">
				<span class="label-text">Cooldown factor</span>
			</label>
			<input type="range" min="0" max="100" bind:value={parameters.cooldownFactor} class="range" step="25" name="cooldown" />
			<div class="w-full flex justify-between text-xs px-2">
				<span>{cooldownOptions[0]}</span>
				<span>{cooldownOptions[25]}</span>
				<span>{cooldownOptions[50]}</span>
				<span>{cooldownOptions[75]}</span>
				<span>{cooldownOptions[100]}</span>
			</div>
		</div>
		{#if showExplanations}
			<div class="divider lg:divider-horizontal" />
			<div class="max-w-md">
				<p>Cooldown factor</p>
			</div>
		{/if}
	</div>

	<!-- Iterations Before Cooldown  -->
	<div class="flex flex-row w-full lg:flex-row pb-8 items-center">
		<div class="form-control" style="min-width: 28rem;">
			<label class="label" for="iteratefor">
				<span class="label-text">Iterations before cooldown</span>
			</label>

			<input type="range" min="0" max="100" bind:value={parameters.iterateFor} class="range" step="25" name="iteratefor" />
			<div class="w-full flex justify-between text-xs px-2">
				<span>{iterateForOptions[0]}</span>
				<span>{iterateForOptions[25]}</span>
				<span>{iterateForOptions[50]}</span>
				<span>{iterateForOptions[75]}</span>
				<span>{iterateForOptions[100]}</span>
			</div>
		</div>
		{#if showExplanations}
			<div class="divider lg:divider-horizontal" />
			<div class="max-w-md">
				<p>Number of iterations before cooling multiplying the temperature by the cooldown factor</p>
			</div>
		{/if}
	</div>

	<!-- Termination After No Improvement  -->
	<div class="flex flex-row w-full lg:flex-row pb-8 items-center">
		<div class="form-control" style="min-width: 28rem;">
			<label class="label" for="termination-after">
				<span class="label-text">Termination after no improvement</span>
			</label>

			<input
				type="range"
				min="0"
				max="100"
				bind:value={parameters.terminationAfter}
				class="range"
				step="25"
				name="termination-after" />
			<div class="w-full flex justify-between text-xs px-2">
				<span>{terminationAfterOptions[0]}</span>
				<span>{terminationAfterOptions[25]}</span>
				<span>{terminationAfterOptions[50]}</span>
				<span>{terminationAfterOptions[75]}</span>
				<span>{terminationAfterOptions[100]}</span>
			</div>
		</div>
		{#if showExplanations}
			<div class="divider lg:divider-horizontal" />
			<div class="max-w-md">
				<p>Number of iterations with no improvement to terminate after</p>
			</div>
		{/if}
	</div>

	<!-- Equal Work Incentive  -->
	<div class="flex flex-row w-full lg:flex-row pb-8 items-center">
		<div class="form-control" style="min-width: 28rem;">
			<label class="label" for="equal-work-incentive">
				<span class="label-text">Equal work incentive</span>
			</label>

			<input
				type="range"
				min="0"
				max="100"
				bind:value={parameters.equalWorkIncentive}
				class="range"
				step="25"
				name="equal-work-incentive" />
			<div class="w-full flex justify-between text-xs px-2">
				<span>{equalWorkIncentiveOptions[0]}</span>
				<span>{equalWorkIncentiveOptions[25]}</span>
				<span>{equalWorkIncentiveOptions[50]}</span>
				<span>{equalWorkIncentiveOptions[75]}</span>
				<span>{equalWorkIncentiveOptions[100]}</span>
			</div>
		</div>
		{#if showExplanations}
			<div class="divider lg:divider-horizontal" />
			<div class="max-w-md">
				<p>
					Incentive to distribute the work equally among all vehicles. Lower incentive values will favor using less
					vehicles and long tours for yielding a shorter collective duration spent on roads.
				</p>
			</div>
		{/if}
	</div>
</div>
