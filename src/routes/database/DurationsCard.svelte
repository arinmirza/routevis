<script lang="ts">
	import Map from "$lib/svg/Map.svelte";
	import { fade } from "svelte/transition";

    export let durations: any[] | null = null;
    let selection = false;

</script>

<!-- Locations -->
<div class="card bg-base-200 w-full text-neutral-content">
    <div class="card-body">
        <div class="flex flex-row items-center">
            <div class="text-3xl font-bold pb">Durations</div>
            {#if !durations}
            <div class="loading loading-spinner loading-lg" style="margin-left: auto"></div>
            {/if}
        </div>
        

        {#if durations && durations.length > 0}
        <div in:fade class="overflow-x-auto pt-4">
            <table class="table">
                <!-- head -->
                <thead>
                    <tr>
                        <th />
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- row 4 -->
                    {#each durations as duration}
                        <tr>
                            <th><Map /></th>
                            <td>{duration.name}</td>
                            <td>{duration.description}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        {/if}

        <!--
        <div in:fade class="flex flex-row place-content-end justify-items-end">
            <div>
                {#if selection}
                    <button in:fade class="btn btn-ghost" style="margin-right: auto">Delete Selected</button>
                {/if}
                <button class="btn btn-ghost" on:click={() => selection = !selection}>
                    {selection ? 'Finish Editing' : 'Edit Durations'}
                </button>
                <button class="btn btn-ghost">Upload New</button>
                
            </div>
        </div>
        -->


    </div>
</div>