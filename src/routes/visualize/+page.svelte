<script lang="ts">
	import type { LatLngExpression, LatLngTuple } from 'leaflet';
	import Leaflet from '$lib/Leaflet.svelte';
	import Marker from '$lib/Marker.svelte';
	import Popup from '$lib/Popup.svelte';
	import Polyline from '$lib/Polyline.svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { Place, Route } from '../types';
	import MapMarker from '../../svg/MapMarker.svelte';

	const initialView: LatLngExpression = [48.137154, 11.576124];

	let locations: Writable<Place[]>;
	let routes: Writable<Route[]>;

	$: locations = getContext('locationsJSON');
	$: routes = getContext('routesJSON');

	let markerLocations: Array<LatLngExpression>;
	$: markerLocations = $locations.map((loc) => [loc[0] as number, loc[1] as number]);

	const getLatLngs = (idxs: number[], lookup: any[]) =>
		idxs.map((idx) => [lookup[idx][0], lookup[idx][1]] as LatLngTuple);

	function randomColor() {
		const random = Math.floor(Math.random() * 10);
		const hue = random * 137.508; // use golden angle approximation
		return `hsl(${hue}, 50%, 75%)`;
	}

	$: colors = $routes.map(() => randomColor());
</script>

<div class="w-full h-screen">
	<Leaflet view={initialView} zoom={12}>
		{#each markerLocations as latLng, i}
			<Marker {latLng}>
				<MapMarker />
				<Popup>{$locations[i][2]} ({i})</Popup>
			</Marker>
		{/each}

		{#each $routes as route, route_idx}
			{#each route as tour, tour_idx}
				<Polyline
					latLngs={getLatLngs(tour, markerLocations)}
					color={colors[route_idx]}
					popup={`Tour ${tour_idx + 1} of Vehicle ${route_idx + 1}`}
				/>
			{/each}
		{/each}
	</Leaflet>
</div>
