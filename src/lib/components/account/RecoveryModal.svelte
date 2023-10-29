<script lang="ts">
	import { fade } from "svelte/transition";
	import { page } from "$app/stores";
	import type { AuthError } from "@supabase/supabase-js";
	import AlertError from "../forms/AlertError.svelte";
	import AlertInfo from "../forms/AlertInfo.svelte";

    export let open = false;

	$: supabase = $page.data.query._supabase;

    let email: string = "";
    let awaiting = false;
    let failed = false;
    let sent = false;
    let authError: AuthError | null = null;

    async function recover() {
        awaiting = true;
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        error && console.error(error);
        failed = error ? true : false;
        sent = error ? false : true;
        authError = error;
        awaiting = false;
    }

    async function closeModal() {
        open = false;
        email = "";
        awaiting = false;
        failed = false;
    }

</script>
	<div transition:fade class="modal" class:modal-open={open}>
		<div class="modal-box">
			<div transition:fade>
				<h3 class="font-bold text-lg">Password Recovery</h3>
				<p class="py-4">Please enter your email address.</p>

				<!-- Email Field -->
				<label class="label" for="recovery-address">
					<span class="label-text">Email</span>
				</label>
				<input type="text" name="recovery-address" placeholder="" class="input input-bordered w-full" bind:value={email} />

				{#if failed}
					<div class="pt-6" transition:fade>
						<AlertError>Password recovery failed! {authError} </AlertError>
					</div>
				{/if}

                {#if sent}
                    <div class="pt-6" transition:fade>
                        <AlertInfo>
                            A recovery email was sent to the address you provided if it exists in our system.
                        </AlertInfo>
                        
                    </div>
                {/if}

				<!-- Buttons -->
				<div class="modal-action">
					<button class="btn" on:click={closeModal}> Close </button>
					<button class={`btn btn-primary' ${awaiting || sent ? 'btn-disabled' : ''}`} on:click={recover}>
						Send Recovery Email
					</button>
				</div>
			</div>
		</div>
	</div>