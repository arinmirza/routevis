<script context="module" src="https://unpkg.com/tangram/dist/tangram.min.mjs"></script>

<script lang="ts">
	import { onMount, onDestroy, setContext, createEventDispatcher, tick } from 'svelte';
	import L, { type LeafletMouseEvent } from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import type { MapLocation } from '$lib/types/map';
	import Marker from './Marker.svelte';
	import MapMarker from '$lib/svg/MapMarker.svelte';
	import Popup from './Popup.svelte';

	export let locations: MapLocation[];
	export let bounds: L.LatLngBoundsExpression | undefined = undefined;
	export let view: L.LatLngExpression | undefined = undefined;
	export let zoom: number | undefined = undefined;

	const dispatch = createEventDispatcher();

	let map: L.Map | undefined;
	let mapElement: HTMLElement;

	onMount(() => {
		if (!bounds && (!view || !zoom)) {
			throw new Error('Must set either bounds, or view and zoom.');
		}

		map = L.map(mapElement)
			// example to expose map events to parent components:
			.on('zoom', (e) => dispatch('zoom', e))
			.on('popupopen', async (e) => {
				await tick();
				e.popup.update();
			});

		L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
			attribution: `🍃 <a href="https://leafletjs.com/">Leaflet</a> | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> | &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>`
		}).addTo(map);

		map.attributionControl.setPrefix(false);

		map.on('click', (e: LeafletMouseEvent) => {
			locations = locations.concat([
				{
					lat: e.latlng.lat,
					lng: e.latlng.lng,
					name: 'New Location',
					demand: 10
				}
			]);
		});
	});

	onDestroy(() => {
		map?.remove();
		map = undefined;
	});

	setContext('map', {
		getMap: () => map
	});

	$: if (map) {
		if (bounds) {
			map.fitBounds(bounds);
		} else if (view && zoom) {
			map.setView(view, zoom);
		}
	}
</script>

<div class="w-full h-full" bind:this={mapElement}>
	{#if map}
		<!-- Display each location as a map marker -->
		{#each locations as location, i}
			<Marker bind:lat={location.lat} bind:lng={location.lng} draggable>
				<MapMarker />
				<Popup>{location.name} ({i}) <br /> {location.lat}, {location.lng}</Popup>
			</Marker>
		{/each}

		<!-- Display other passed components -->
		<slot />
	{/if}
</div>
