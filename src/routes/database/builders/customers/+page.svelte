<script lang="ts">
	import type { MapLocation } from "$lib/types/map";
	import type { LatLngExpression } from "leaflet";
	import LeafletCustomizable from "$lib/components/leaflet/LeafletBuilder.svelte";

	let locations: MapLocation[] = [];
    export let initialView: LatLngExpression = { lat: 48.137154, lng: 11.576124 };

</script>

<div class="w-full" style={'height: calc(100vh - 4rem - 5rem)'}>
	<LeafletCustomizable view={initialView} zoom={12} bind:locations />
</div>