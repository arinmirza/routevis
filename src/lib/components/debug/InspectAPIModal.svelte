<script lang="ts">
	export let open = false;
	export let contentType: string = 'Content-Type: application/json';

	export let body1: any = undefined;
	export let body2: any = undefined;
	export let body3: any = undefined;
	export let request1: string = "";
	export let request2: string = "";
	export let request3: string = "";

	function getCurlString(endpoint: string, body: any) {
		return [`curl -X POST ${endpoint} \\`, `-H '${contentType}' \\`, `-d '${JSON.stringify(body, null, 4)}'`].join(
			'\n'
		);
	}
</script>

<div class="modal" class:modal-open={open}>
	<div class="modal-box" style="min-width: 50%; margin-left: 320px">
		<div>
			<div class="text-2xl font-bold pb-4">Inspect API Call</div>
		</div>

		{#if body1}
			<div class="card w-full bg-neutral text-primary-content">
				<div class="card-body">
					<p
						class="text-neutral-content"
						style="white-space: pre-wrap; font-family: monospace; font-size: 1rem; max-height: 30rem; overflow: scroll; word-wrap: break-word;">
						{getCurlString(request1, body1)}
					</p>
				</div>
			</div>

			<div class="p-4" />
		{/if}

		{#if body2}
			<div class="card w-full bg-neutral text-primary-content">
				<div class="card-body">
					<p
						class="text-neutral-content"
						style="white-space: pre-wrap; font-family: monospace; font-size: 1rem; max-height: 30rem; overflow: scroll; word-wrap: break-word;">
						{getCurlString(request2, body2)}
					</p>
				</div>
			</div>

			<div class="p-4" />
		{/if}


		{#if body3}
			<div class="card w-full bg-neutral text-primary-content">
				<div class="card-body">
					<p
						class="text-neutral-content"
						style="white-space: pre-wrap; font-family: monospace; font-size: 1rem; max-height: 30rem; overflow: scroll; word-wrap: break-word;">
						{getCurlString(request3, body3)}
					</p>
				</div>
			</div>

			<div class="p-4" />
		{/if}

		<!--
		{#each requestBodies as body, i}
		<div class="card w-full bg-neutral text-primary-content">
			<div class="card-body">
				<p class="text-neutral-content" style="white-space: pre-wrap; font-family: monospace; font-size: 1rem; max-height: 30rem; overflow: scroll; word-wrap: break-word;">
					{getCurlString(i)}
				</p>
			</div>
		</div>


        <div class="p-4"/>

		{/each}

		-->
		<div class="flex flex-row place-content-end justify-items-end">
			<div>
				<button
					class="btn btn-secondary"
					on:click={() => {
						open = false;
					}}>Close</button>
			</div>
		</div>

		<div class="pt-6" />
	</div>
</div>
