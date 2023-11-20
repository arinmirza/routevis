<script lang="ts">
	export let open = false;
	export let requestBody: string = '';
	export let contentType: string = 'Content-Type: application/json';
	export let endpoint: string = 'https://vrpms-rpke.vercel.app/api/vrp/ga';

	$: curlString = [
		`curl -X POST ${endpoint} \\`,
		`-H '${contentType}' \\`,
		`-d '${requestBody}'`
	].join('\n');
</script>

<div class="modal" class:modal-open={open}>
	<div class="modal-box" style="min-width: 50%; margin-left: 320px">
		<div>
			<div class="text-2xl font-bold pb-4">Inspect API Call</div>
		</div>


		<div class="card w-full bg-neutral text-primary-content">
			<div class="card-body">
				<p class="text-neutral-content" style="white-space: pre-wrap; font-family: monospace; font-size: 1rem; max-height: 30rem; overflow: scroll; word-wrap: break-word;">
					{curlString}
				</p>
			</div>
		</div>


        <div class="p-4"/>

        <div class="flex flex-row place-content-end justify-items-end">
            <div>
                <button
				class="btn btn-secondary"
				on:click={() => {
					open = false;
				}}>Close</button>
            </div>
        </div>


		<div class="pt-6">
			
		</div>
	</div>
</div>
