<script lang="ts">
	import Leaflet from "$lib/components/leaflet/Leaflet.svelte";
	import Marker from "$lib/components/leaflet/Marker.svelte";
	import Popup from "$lib/components/leaflet/Popup.svelte";
	import MapMarker from "$lib/svg/MapMarker.svelte";
	import type { MapLocation, Solution } from "$lib/types/map";
	import type { LatLngTuple } from "leaflet";
	import { VehicleController } from "./VehicleController";
	import VehicleMarker from "$lib/components/leaflet/VehicleMarker.svelte";
	import Polyline from "$lib/components/leaflet/Polyline.svelte";


    export let solution: Solution;
    export let currentTime: number;
    export let initialView: LatLngTuple = [48.137154, 11.576124];
    
    // Vehicle Simulators
    let simulators: VehicleController[] = [];
    $: simulators = solution.vehicles.filter(plan => plan.tours.flatMap(x => x).length > 0).map(plan => new VehicleController(plan));
    $: colors = simulators.map((_, i) => {
		if (i == 0) return "red";
		if (i == 1) return "blue";
		if (i == 2) return "orange";
		if (i == 3) return "brown";
		if (i == 4) return "magenta";
		return randomColor()
	});


    // Coloring
    function randomColor() {
		const random = Math.floor(Math.random() * 10);
		const hue = random * 137.508; // use golden angle approximation
		return `hsl(${hue}, 50%, 75%)`;
	}

	$: currentTime, console.log("currentTime", currentTime)



</script>


<div class="w-full" style={'height: calc(100vh - 4rem - 5rem)'}>
	<Leaflet view={initialView} zoom={12}>

        <!-- Display each location as a map marker -->
		{#each solution.locations as location, i}
			<Marker lat={location.lat} lng={location.lng}>
				<MapMarker />
				<Popup>{location.name} ({i}) <br> {location.lat}, {location.lng}</Popup>
			</Marker>
		{/each}

        <!-- Display a vehicle marker for each simulator -->
		{#each simulators as simulator, i}
			<VehicleMarker latLng={simulator.getPosition(currentTime)}>
				<img src="/images/iso-truck.png" alt="truck" style="margin-top: -20px; margin-left: -10px" />
				<p style="margin-top: -30px; margin-left: 30px; font-size: 1.5rem; color: #191e24">{i + 1}</p>
				
			</VehicleMarker>
		{/each} 

        <!-- Display tours as polylines on map -->
        {#each solution.vehicles as vehicle, vehicleIdx}
            {#each vehicle.tours as tour, tourIdx}
                <Polyline 
                    latLngs={tour.map(stop => [stop.lat, stop.lng])}
                    color={colors[vehicleIdx]}
                    popup={`Tour ${tourIdx + 1} of Vehicle ${vehicleIdx + 1}`} />
                />
            {/each}
        {/each}
		
	</Leaflet>
</div>

