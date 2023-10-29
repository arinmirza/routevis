<script lang="ts">
    import {} from 'leaflet.marker.slideto' /* Do not delete, breaks */

    export let marker: L.Marker;
    export let waypoints: L.Marker[] = [];


    /*
waypoints.forEach((marker, index) => {
    setTimeout(() => {
      const { lat, lng } = marker.getLatLng();
      marker.slideTo([lat, lng], { duration: 1000 });
  
      let markerBefore =
        index === 0
          ? waypoints[0]
          : [waypoints[index - 1].getLatLng()];
  
    }, index * 1000);
  });
  */


</script>

