<script lang="ts">
	import type { LocationSet } from '$lib/database/queries/locations';
	import type { Query } from '$lib/database/queries/query';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import axios from 'axios';

	export let data: PageData;
	const { query } = data;

	let locations: LocationSet[] = [];

	onMount(async () => {
		locations = await query.locations.all();

		let a = await axios.get('https://vrpms.vercel.app/api/');
		console.log(a);

	});

	$: console.log(locations);

</script>

{JSON.stringify(locations)}