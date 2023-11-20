<script lang="ts">
	import '../app.css';
	import { getContext, onMount, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import locationsPreset from '../locations-preset.json';
	import routesPreset from '../routes-preset.json';
	import Github from '../lib/svg/Github.svelte';
	import { page } from '$app/stores';
	import Toolset from '../lib/svg/Toolset.svelte';
	import Database from '../lib/svg/Database.svelte';
	import Docs from '../lib/svg/Docs.svelte';
	import Truck from '../lib/svg/Truck.svelte';
	import Info from '../lib/svg/Info.svelte';
	import Home from '../lib/svg/Home.svelte';
	import UserModal from '$lib/components/account/UserModal.svelte';
	import { invalidateAll } from '$app/navigation';

	$: path = $page.url.pathname;
	$: user = $page.data.session?.user.email;
	$: supabase = $page.data.query._supabase;

	setContext("loginModal", writable<boolean>(false));



	let loginModalOpen = getContext<Writable<boolean>>("loginModal");
	

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			invalidateAll();
		});

		return () => {
			subscription.unsubscribe();
		};
	});
	
</script>

{#if path === '/'}
	<slot />
{:else}
	<UserModal bind:open={$loginModalOpen} />

	<div class="navbar bg-base-300">
		<div class="flex-1">
			<a href="/tutorial" class="btn btn-ghost normal-case text-xl">routevis</a>
		</div>
		<div class="flex-none gap-2">
			<div>
				<button class="btn btn-md btn-ghost" on:click={() => ($loginModalOpen = true)}> {user ?? 'Login'} </button>
			</div>
		</div>
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

				<!--
			<div class="items-center" style="padding-bottom: 2rem;">
				<div class="stats stats-vertical shadow min-w-full">
					<div class="stat">
						<div class="stat-title">Total Duration</div>
						<div class="stat-value">0:00</div>
						
					</div>

					<div class="stat">
						<div class="stat-title">Max Duration</div>
						<div class="stat-value">0:00</div>
						
					</div>

					<div class="stat">
						<div class="stat-title">Locations</div>
						<div class="stat-value">{locationsCount}</div>
					
					</div>

					<div class="stat">
						<div class="stat-title">Vehicles</div>
						<div class="stat-value">{vehicleCount}</div>
					
					</div>
				</div>
			</div>
			-->

				<div class="flex items-center" style="width: 100%; padding-top: 1rem; padding-bottom: 1rem;">
					<div><Home /></div>
					<div class="p-1" />
					<div class="text-xl">Welcome</div>
				</div>

				<li>
					<a class={`${path === '/welcome' ? 'active' : ''}`} href="/tutorial">Tutorial <span class="text-error">(todo)</span></a>
				</li>

				<div class="flex items-center" style="width: 100%; padding-top: 1rem; padding-bottom: 1rem;">
					<div><Truck /></div>
					<div class="p-1" />
					<div class="text-xl">Algorithms</div>
				</div>

				<li>
					<a class={`${path === '/algorithms/vrp' ? 'active' : ''}`} href="/algorithms/vrp">Vehicle Routing Problem</a>
				</li>

				<li>
					<a class={`${path === '/algorithms/tsp' ? 'active' : ''}`} href="/algorithms/tsp">Travelling Salesman Problem <span class="text-error">(todo)</span></a>
					
				</li>

				<div class="flex items-center" style="width: 100%; padding-top: 1rem; padding-bottom: 1rem;">
					<div><Toolset /></div>
					<div class="p-1" />
					<div class="text-xl">Tools</div>
				</div>

				<li>
					<a class={`${path === '/tools/benchmark' ? 'active' : ''}`} href="/tools/benchmark">Benchmarking <span class="text-error">(todo)</span></a>
				</li>

				<li>
					<a class={`${path === '/tools/visualize' ? 'active' : ''}`} href="/tools/visualize"> Visualization </a>
				</li>

				<!-- Data -->

				<div class="flex items-center" style="width: 100%; padding-top: 1rem; padding-bottom: 1rem">
					<div><Database /></div>
					<div class="p-1" />
					<div class="text-xl">Database</div>
				</div>

				<li>
					<a class={`${path === '/locations' ? 'active' : ''}`} href="/scenario">Saved Scenarios</a>
				</li>

				<!--
				<li>
					<a class={`${path === '/durations' ? 'active' : ''}`} href="/scenario">Scenario Builder</a>
				</li>
				-->

				<div class="flex items-center" style="width: 100%; padding-top: 1rem; padding-bottom: 1rem">
					<div><Docs /></div>
					<div class="p-1" />
					<div class="text-xl">Documentation</div>
				</div>

				<!--
				<li>
					<a class={`${path === '/docs/project' ? 'active' : ''}`} href="/docs/project">Project</a>
				</li>
				-->

				<li>
					<a class={`${path === '/docs/algorithms' ? 'active' : ''}`} href="/docs/algorithms">Algorithms <span class="text-error">(todo)</span></a>
				</li>

				<li>
					<a class={`${path === '/docs/references' ? 'active' : ''}`} href="/docs/references">References <span class="text-error">(todo)</span></a>
				</li>
			</ul>
		</div>
	</div>

	<footer class="footer items-center p-4 bg-neutral text-neutral-content">
		<aside class="items-center grid-flow-col">
			
			<p>
				2023 routevis, an open source supply route optimization and visualization tool.
			</p>
		</aside>
		<nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
			<a href="https://github.com/arinmirza/routevis"><Github /></a>
		</nav>
	</footer>
{/if}
