<script lang="ts">
	import type { Solution } from "$lib/types/map";

    export let solutions: Solution[];
	export let visualize: boolean;
    export let selectedSolutionId: number | null;

	$: selectedSolutionId, console.log("selected soltuion", selectedSolutionId)

	function findById<T extends { id: K }, K>(array: T[], id: K) {
		return array.find((elem) => elem?.id === id);
	}

	function prettyTimestamp(ts: string) {
		if (!ts) return '';
		const date = ts.split('T')?.[0];
		const time = ts.split('T')?.[1]?.split('.')?.[0];
		return `${date} ${time}`;
	}


</script>

<div class="w-full" style={'height: calc(100vh - 4rem - 5rem)'}>
	<div id="content-wrapper" class="p-9 flex flex-col content-center items-center">
		<div id="main-content" style="min-width: 60%">
			<div id="title" class="text-4xl font-bold pb-8 text-center">Visualization</div>

			<!-- Scenario Card -->
			<div class="card bg-base-200 w-full text-neutral-content">
				<div class="card-body">
					<div id="title" class="text-3xl font-bold pb-4">Solution</div>

					<p>Select a solution to be visualized. </p>

					


                    <div class="form-control p-4">
                        <select class="select select-bordered" id="solution-select" bind:value={selectedSolutionId}>
                
                            <option selected disabled value={null}>Select a solution</option>
                            {#each solutions as solution}
                                <option value={solution.id}>[{prettyTimestamp(solution.created_at)}] {solution.name}</option>
                            {/each}
                        </select>
						<label class="label" for="soltuion-select">
							<span class="label-text text-gray-500">
								<span class="font-bold">Description: </span>
								{findById(solutions, selectedSolutionId)?.description ?? ''}
							</span>
						</label>
                    </div>


					<button class={`btn ${selectedSolutionId === null ? 'btn-disabled' : 'btn-primary'}`} on:click={() => visualize = true }>OK</button>



				</div>
			</div>
		</div>
	</div>
</div>
