<script lang="ts">
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import EventMenu from './EventMenu.svelte';
	

    export let open = false;

    let isEventMenuOpen = false;

    //let solutions: Writable<Solution[]>;
    //$: solutions = getContext('solutionsJSON');



    //export let solutions: [] = [];


</script>

<EventMenu bind:open={isEventMenuOpen} />

<div class="modal" class:modal-open={open}>
	<div class="modal-box" style="margin-left: 320px; margin-top: -64px">
		<div transition:fade />

        <div class="flex flex-row items-center">
            <div class="text-2xl font-bold pb">Visualization</div>
        </div>

        
        <div class="p-4"/>

        
            <div class="text-xl font-bold pb">Solutions</div>
            <div class="pt-1">Select the solutions to be visualized.</div>
            
        
        
        <div class="p-1"/>
        
        <div style="max-height: 15rem; overflow: auto; border: 1px solid hsl(var(--nf)); border-radius: 10px">
            <div class="pl-4 pt-4">
        {#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,] as solution, idx}
            <div class="flex flex-row">
                <div class="pr-2">
                    <input type="checkbox" class="checkbox" />
                </div>
                <p>Mock Solution {idx}</p>
            </div>
            {/each}
        </div>
        </div>

        <div class="p-4"/>

        <div class="text-xl font-bold pb">Events</div>
        <div class="pt-1">
            You can add a dynamic event at the current point in time. 
            This will request a new solution with the updated duration matrix, 
            and the current positions and capacities of the vehicles.
        </div>
        <div class="flex place-content-center pt-1">
            <button class="btn btn-ghost" on:click={() => {open = false; isEventMenuOpen = true; } }>Add an Event</button>
        </div>


        <div class="flex place-content-end">
            <button class="btn btn-ghost" on:click={() => open = false }>Done</button>
        </div>
	</div>

    
</div>
