<script>

	import { fade } from "svelte/transition";

</script>
<div transition:fade class="flex place-content-center">
    <div class="max-w-md">
        <progress class="progress min-w-md" />
        <div class="text-center pt-4">
            <div>Solving, this may take a minute or two..</div>
        </div>
    </div>
</div>