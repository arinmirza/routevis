<script lang="ts">
	import '../app.css';
	import { setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import locationsPreset from '../locations-preset.json';
	import routesPreset from '../routes-preset.json';
	import Github from '../svg/Github.svelte';
	import { page } from '$app/stores';
	import type { Route } from './types';

	$: selectedPage = $page.url.pathname;

	const locationsInput: Writable<string> = writable(JSON.stringify(locationsPreset));
	const routesInput: Writable<string> = writable(JSON.stringify(routesPreset));
	const locationsJSON: Writable<Location[]> = writable(JSON.parse($locationsInput));
	const routesJSON: Writable<Route[]> = writable(JSON.parse($routesInput));

	setContext('locationsInput', locationsInput);
	setContext('locationsJSON', locationsJSON);
	setContext('routesInput', routesInput);
	setContext('routesJSON', routesJSON);

	$: vehicleCount = $routesJSON.length;
	$: locationsCount = $locationsJSON.length;
</script>



<div class="navbar bg-base-300">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case text-xl">routevis</a>
	</div>
	<div class="flex-none gap-2" />
</div>

<div class="drawer lg:drawer-open">
	<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<!-- Page content here -->
		<slot />
		<label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>
	</div>
	<div class="drawer-side">
		<label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay" />

		<ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
			<!-- Sidebar content here -->

			<div class="items-center" style="padding-bottom: 2rem;">
				<div class="stats stats-vertical shadow min-w-full">
					<div class="stat">
						<div class="stat-title">Total Duration</div>
						<div class="stat-value">0:00</div>
						<!--<div class="stat-desc">Jan 1st - Feb 1st</div>-->
					</div>

					<div class="stat">
						<div class="stat-title">Max Duration</div>
						<div class="stat-value">0:00</div>
						<!--<div class="stat-desc">↗︎ 400 (22%)</div>-->
					</div>

					<div class="stat">
						<div class="stat-title">Locations</div>
						<div class="stat-value">{locationsCount}</div>
						<!--<div class="stat-desc">↘︎ 90 (14%)</div>-->
					</div>

					<div class="stat">
						<div class="stat-title">Vehicles</div>
						<div class="stat-value">{vehicleCount}</div>
						<!--<div class="stat-desc">↘︎ 90 (14%)</div>-->
					</div>
				</div>
			</div>

			<div style="padding-bottom: 1rem">
				<span class="text-xl">Tools</span>
			</div>

			<li>
				<a class={`${selectedPage === '/visualize' ? 'active' : ''}`} href="/visualize"
					>Visualization</a
				>
			</li>

			<li>
				<a class={`${selectedPage === '/scenario' ? 'active' : ''}`} href="/scenario">Scenario</a>
			</li>
		</ul>
	</div>
</div>

<footer class="footer items-center p-4 bg-neutral text-neutral-content">
	<aside class="items-center grid-flow-col">
		<svg
			width="36"
			height="36"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			fill-rule="evenodd"
			clip-rule="evenodd"
			class="fill-current"
			><path
				d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"
			/></svg
		>
		<p>
			2023 - Open source route visualization tool. As a part of interdisciplinary project at TU
			Munich, in collaboration with SAP.
		</p>
	</aside>
	<nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
		<a href="https://github.com/arinmirza/routevis"><Github /></a>
	</nav>
</footer>
