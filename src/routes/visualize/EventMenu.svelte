<script lang="ts">
	import SimulatedAnnealing, { type SimulatedAnnealingParameters } from '$lib/components/forms/algorithms/SimulatedAnnealing.svelte';
import { fade } from 'svelte/transition';

	export let open = false;

	let selectedEvent: string | null = null;
    let selectedAlgorithm: string | null = null;

	let congestionMultiplier = 5.0;
	let congestedLocations: string = '';
	let vehiclesInAccident: string = '';
	let cancelledLocations: string = '';



    /* Simulated Annealing Parameters */
	let saParameters: SimulatedAnnealingParameters = {
		initialTemperature: 50,
		cooldownFactor: 50,
		iterateFor: 50,
		terminationAfter: 50,
		equalWorkIncentive: 50,
	}





	function closeModal() {
		open = false;
		selectedEvent = null;
		congestionMultiplier = 5.0;
		congestedLocations = '';
		vehiclesInAccident = '';
		cancelledLocations = '';
	}
</script>

<div class="modal" class:modal-open={open}>
	<div class="modal-box" style="margin-left: 320px; margin-top: -64px;">
		<div transition:fade />

		<div class="flex flex-row items-center">
			<div class="text-2xl font-bold pb">New Event</div>
		</div>

		<div class="p-4" />

		<div class="text-xl font-bold pb">Select Event Type</div>

		<div class="p-2" />

		<div>
			<div class="p-2" style="border: 1px solid hsl(var(--nf)); border-radius: 10px">
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text">
							<span class="text-lg">Traffic Congestion</span>
						</span>
						<input
							type="radio"
							name="event-type"
							class="radio checked:bg-purple-500"
							bind:group={selectedEvent}
							value="congestion" />
					</label>
				</div>

				<div class="pl-1">
					<p style="color: #6b7280">Increase the travel-time from and to selected locations.</p>
				</div>
			</div>

			<div class="p-1" />

			<div class="p-2" style="border: 1px solid hsl(var(--nf)); border-radius: 10px">
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text">
							<div class="flex flex-column">
								<span class="text-lg">Car Accident</span>
							</div>
						</span>
						<input
							type="radio"
							name="event-type"
							class="radio checked:bg-purple-500"
							value="accident"
							bind:group={selectedEvent} />
					</label>
				</div>

				<div class="pl-1">
					<p style="color: #6b7280">Remove some vehicles from your fleet.</p>
				</div>
			</div>

			<div class="p-1" />

			<div class="p-2" style="border: 1px solid hsl(var(--nf)); border-radius: 10px">
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text">
							<div class="flex flex-column">
								<span class="text-lg">Customer Cancellation</span>
							</div>
						</span>
						<input
							type="radio"
							name="event-type"
							class="radio checked:bg-purple-500"
							value="cancellation"
							bind:group={selectedEvent} />
					</label>
				</div>

				<div class="pl-1">
					<p style="color: #6b7280">Ignore some locations in the remaining operation.</p>
				</div>
			</div>
		</div>

		{#if selectedEvent}
			<div in:fade class="p-4" />

			<div class="text-xl font-bold pb">Select Event Parameters</div>

			<div class="p-1" />

			{#if selectedEvent === 'congestion'}
				<div in:fade class="form-control w-full">
					<label class="label" for="event-locations">
						<span class="label-text">Congested Locations</span>
					</label>
					<input type="text" class="input input-bordered w-full" name="event-locations" />
					<label class="label" for="event-locations">
						<span class="label-text-alt text-gray-500 w-full">
							Provide a JSON array consisting of comma separated integers.<br />
							The integers represent the indexes of locations affected by traffic congestion. <br /> <br />
							The selected algorithm will be called with the transformed duration matrix of the currently visualized solution.
							The rest of the scenario parameters of the currently visualized solution will be forwarded without changing.
						</span>
					</label>
				</div>

				<div in:fade class="form-control w-full">
					<label class="label" for="congestion-multiplier">
						<span class="label-text">Congestion Multiplier</span>
					</label>
					<input
						type="text"
						class="input input-bordered w-full"
						name="congestion-multiplier"
						bind:value={congestionMultiplier} />
					<label class="label" for="congestion-multiplier">
						<span class="label-text-alt text-gray-500">
							Provide a dot separated floating point number or an integer.
						</span>
					</label>
				</div>
			{:else if selectedEvent === 'accident'}
				<div in:fade class="form-control w-full">
					<label class="label" for="crashed-vehicles">
						<span class="label-text">Vehicles in Accident</span>
					</label>
					<input
						type="text"
						class="input input-bordered w-full"
						name="crashed-vehicles"
						bind:value={vehiclesInAccident} />
					<label class="label" for="crashed-vehicles">
						<span class="label-text-alt text-gray-500">
							Provide a JSON array consisting of comma separated integers.<br />
							The integers represent the indexes of vehicles to be removed. <br /> <br />
							The selected algorithm will be called with the dropped vehicles list, and the scenario parameters of the currently
							visualized solution.
						</span>
					</label>
				</div>
			{:else if selectedEvent === 'cancellation'}
				<div in:fade class="form-control w-full">
					<label class="label" for="cancelled-customers">
						<span class="label-text">Cancelled Customers</span>
					</label>
					<input
						type="text"
						class="input input-bordered w-full"
						name="cancelled-customers"
						bind:value={cancelledLocations} />
					<label class="label" for="cancelled-customers">
						<span class="label-text-alt text-gray-500">
							Provide a JSON array consisting of comma separated integers.<br />
							The integers represent the indexes of locations to be ignored. <br /> <br />
							The selected algorithm will be called with the cancelled customers list, and the scenario parameters of the
							currently visualized solution.
						</span>
					</label>
				</div>
			{/if}

		{/if}

		<div class="p-3" />

        <div class="text-xl font-bold pb">Select Algorithm</div>

		<div class="p-1" />

        <div class="form-control w-full" >
            <label class="label" for="algorithm">
            <select class="select select-bordered w-full" id="algorithm" bind:value={selectedAlgorithm}>
                <option value={null} disabled selected>Select a VRP solver</option>
                <option value="ant" disabled>Ant Colony Optimization</option>
                <option value="ga" disabled>Genetic Algorithm</option>
                <option value="sa">Simulated Annealing</option>
            </select>
        </div>

        {#if selectedAlgorithm === 'sa'}
            <div class="p-2" />
            <SimulatedAnnealing bind:parameters={saParameters} />
        {/if}

        <div class="p-2" />

		<div class="flex place-content-center">
			<div>
				<button class="btn btn-ghost" on:click={closeModal}>Cancel</button>
				<button class={`btn ${!selectedEvent ? 'btn-disabled' : 'btn-ghost'}`} on:click={closeModal}
					>Show Api Call</button>
                <button class={`btn ${!selectedEvent ? 'btn-disabled' : 'btn-secondary'}`} on:click={closeModal}>Solve & Save</button>
				<button class={`btn ${!selectedEvent ? 'btn-disabled' : 'btn-primary'}`} on:click={closeModal}>Solve</button>
			</div>
		</div>
	</div>
</div>
