<script lang="ts">
	import { onMount, onDestroy, getContext, setContext, createEventDispatcher } from 'svelte';
	import L, { type LeafletMouseEvent } from 'leaflet';

	export let width: number = 20;
	export let height: number = 20;
	export let lat: number;
	export let lng: number;
	export let draggable = false;

	let marker: L.Marker | undefined;
	let markerElement: HTMLElement;

	const { getMap }: { getMap: () => L.Map | undefined } = getContext('map');
	const map = getMap();
	const dispatch = createEventDispatcher<{ dragend: L.DragEndEvent & { lat: number, lng: number } }>();

	setContext('layer', {
		// L.Marker inherits from L.Layer
		getLayer: () => marker
	});

	onMount(() => {
		if (map) {
			let icon = L.divIcon({
				html: markerElement,
				className: 'map-marker',
				iconSize: L.point(width, height)
			});
			marker = L.marker({ lat, lng }, { icon, draggable }).addTo(map);

			if (draggable) {
				marker.on('dragend', ((e: L.DragEndEvent) => {
					lat = e.target._latlng.lat;
					lng = e.target._latlng.lng;
				}));
			}

		}

	});

	onDestroy(() => {
		marker?.remove();
		marker = undefined;
	});
</script>

<div bind:this={markerElement}>
	{#if marker}
		<slot />
	{/if}
</div>
