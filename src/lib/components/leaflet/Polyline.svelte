<script lang="ts">
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import L from 'leaflet';
	import * as decorate  from 'leaflet-polylinedecorator' /* Do not delete, breaks */
	

	export let latLngs: L.LatLngExpression[];
	export let color: string = "black";
	export let opacity: number = 1;
    export let weight: number = 5;
    export let popup: string = "";

    let polyline: L.Polyline | undefined;
	let decorator: L.PolylineDecorator | undefined;
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
			decorator = L.polylineDecorator(polyline, { patterns: [
        		// defines a pattern of 10px-wide dashes, repeated every 20px on the line
        		{offset: 0, repeat: 100, symbol: L.Symbol.arrowHead({pixelSize: 15, pathOptions: { fillColor: color, color, fillOpacity: 1}})}
    		]}).bindPopup(popup).addTo(map);
		}
	});

	onDestroy(() => {
        polyline?.remove();
		decorator?.remove();
        polyline = undefined;
		decorator = undefined;
	});
</script>

<div bind:this={polylineElement}>
	{#if polyline}
		<slot />
	{/if}
</div>
