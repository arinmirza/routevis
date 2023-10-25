<script lang="ts">
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import L from 'leaflet';

	export let latLngs: L.LatLngExpression[];
	export let color: string = "black";
	export let opacity: number = 1;
    export let weight: number = 5;
    export let popup: string = "";

    let polyline: L.Polyline | undefined;
    let polylineElement: HTMLElement;

	const { getMap }: { getMap: () => L.Map | undefined } = getContext('map');
	const map = getMap();

	setContext('layer', {
		// L.Marker inherits from L.Layer
		getLayer: () => polyline
	});

	onMount(() => {
		if (map) {
            polyline = L.polyline(latLngs, { color, opacity, weight }).bindPopup(popup).addTo(map);
		}
	});

	onDestroy(() => {
        polyline?.remove();
        polyline = undefined;
	});
</script>

<div bind:this={polylineElement}>
	{#if polyline}
		<slot />
	{/if}
</div>
