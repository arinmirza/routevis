<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { validateLocations, validateRoutes } from './validator';

	let selectedTab: 'locations' | 'routes' = 'routes';

	// Retrieve saved values from context
	const locationsInput: Writable<string> = getContext('locationsInput');
	const locations: Writable<ArrayLike<ArrayLike<unknown>>> = getContext('locationsJSON');
	const routesInput: Writable<string> = getContext('routesInput');
	const routes: Writable<number[][][]> = getContext('routesJSON');

	let locationsError: unknown = null;
	let routesError: unknown = null;

	/** Parses the locations input string as JSON and saves if valid. */
	function parseLocations() {
		try {
			const parsed = JSON.parse($locationsInput);
			validateLocations(parsed);
			$locations = parsed;
			locationsError = null;
		} catch (e: unknown) {
			locationsError = e;
		}
	}

	/** Parses the routes input string as JSON and saves if valid. */
	function parseRoutes() {
		try {
			const parsed = JSON.parse($routesInput);
			validateRoutes(parsed, $locations.length);
			$routes = parsed;
			routesError = null;
		} catch (e: unknown) {
			routesError = e;
		}
	}
</script>

<div class="p-8">
	<div id="title" class="text-4xl font-bold">
		<h1>Scenario</h1>
	</div>

	<div class="tabs content-start" style="padding: 1rem 0 1rem 0">
		<button
			class={`tab tab-lg tab-lifted ${selectedTab === 'routes' ? 'tab-active' : ''}`}
			on:click={() => (selectedTab = 'routes')}
		>
			Routes
		</button>

		<button
			class={`tab tab-lg tab-lifted ${selectedTab === 'locations' ? 'tab-active' : ''}`}
			on:click={() => (selectedTab = 'locations')}
		>
			Locations
		</button>
	</div>

	{#if selectedTab === 'locations'}
		<div class="flex" style="width: 100%">
			<div class="form-control w-1/2">
				<!-- Locations Input Field -->
				<textarea class="textarea-lg textarea-bordered h-[50vh]" bind:value={$locationsInput} />
				<div class="p-1" />
				<button class="btn" on:click={parseLocations}>Parse and Save</button>

				<div class="p-3" />

				<!-- Locations Description -->
				<p>Specify the locations to visualize on the map in JSON format.</p>
				<p>A location is specified by an array consisting of [lat, lon, name] values.</p>
				<p>The input should be an array of such locations.</p>
			</div>

			<div class="p-2" />

			<!-- Locations Table Preview -->
			<div class="overflow-x-auto">
				<table class="table table-xs">
					<thead>
						<tr>
							<td>#</td>
							<td>Lat</td>
							<td>Lon</td>
							<td>Name</td>
						</tr>
					</thead>
					<tbody>
						{#each $locations as location, i}
							<tr>
								<td>{i}</td>
								<td>{location[0]}</td>
								<td>{location[1]}</td>
								<td>{location[2]}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Locations Toast Notification upon Error -->
		{#if locationsError}
			<div class="toast toast-top toast-end">
				<div class="alert alert-error">
					<span>{locationsError}</span>
					<button
						class="btn btn-ghost"
						on:click={() => {
							locationsError = null;
						}}>Close</button
					>
				</div>
			</div>
		{/if}
	{:else if selectedTab === 'routes'}
		<div class="flex" style="width: 100%">
			<div class="form-control w-1/2">
				<!-- Routes Input Field -->
				<textarea class="textarea-lg textarea-bordered h-[50vh]" bind:value={$routesInput} />
				<div class="p-1" />
				<button class="btn" on:click={parseRoutes}>Parse and Save</button>

				<div class="p-3" />

				<!-- Routes Description -->
				<p>Specify the routes to visualize on the map in JSON format.</p>
				<p>A <strong>tour</strong> is specified by an array consisting of location ids.</p>
				<p>A <strong>route</strong> is an array of tours. Each route corresponds to a vehicle.</p>
				<p>The input should be an array of routes.</p>
			</div>

			<div class="p-2" />

			<!-- Routes Accordion View -->

			<div class="flex flex-col w-1/2">
				{#each $routes as route, route_idx}
					<div class="collapse collapse-plus bg-base-200">
						<input type="checkbox" name="my-accordion-1" checked={true} />
						<div class="collapse-title text-xl font-medium">
							Vehicle {route_idx + 1}
						</div>
						<div class="collapse-content">
							<ul>
								{#each route as tour, tour_idx}
									<li><strong>Tour #{tour_idx + 1}:</strong> {tour.join(' ➔ ')}</li>
								{/each}
							</ul>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Routes Toast Notification upon Error -->
		{#if routesError}
			<div class="toast toast-top toast-end">
				<div class="alert alert-error">
					<span>{routesError}</span>
					<button
						class="btn btn-ghost"
						on:click={() => {
							routesError = null;
						}}>Close</button
					>
				</div>
			</div>
		{/if}
	{/if}
</div>
