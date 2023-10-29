<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import RecoveryModal from './RecoveryModal.svelte';
	import AlertError from '../forms/AlertError.svelte';
	import type { AuthError } from '@supabase/supabase-js';

	export let open = false;

	let email: string = '';
	let password: string = '';

	$: username = $page.data.session?.user.email;
	$: supabase = $page.data.query._supabase;

	let awaiting = false;
	let failed = false;
    let recovery = false;
    let authError: AuthError | null = null;

	async function login() {
		awaiting = true;
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		error && console.error('Login:', error);
		awaiting = false;
		failed = error ? true : false;
        authError = error;
		!failed && closeModal();
	}

	async function logout() {
		closeModal();
		await supabase.auth.signOut();
		failed = false;
	}

	async function closeModal() {
		open = false;
		awaiting = false;
        email = '';
        password = '';
		failed = false;
	}
</script>

<RecoveryModal bind:open={recovery} />

<div class="modal" class:modal-open={open}>
	<div class="modal-box">
		{#if !username}
        <div transition:fade>
			<h3 class="font-bold text-lg">Login</h3>
			<p class="py-4">You can save and access your company data by logging in.</p>

			<div class="flex flex-col w-full lg:flex-row items-center">
				<div class="form-control w-full">
					<!-- Email Field -->
					<label class="label" for="email">
						<span class="label-text">Email</span>
					</label>
					<input type="email" name="email" placeholder="" class="input input-bordered w-full" bind:value={email} />

					<div class="p-2" />

					<!-- Password Field -->
					<label class="label" for="password">
						<span class="label-text">Password</span>
					</label>
					<input
						type="password"
						name="password"
						placeholder=""
						class="input input-bordered w-full"
						bind:value={password} />

					{#if failed}
						<div class="pt-6" transition:fade>
							<AlertError>Login failed! {authError}</AlertError>
						</div>
					{/if}

                    <div class="pt-6">
                        <button on:click={() => {recovery = true; closeModal();}}>Forgot your password?</button>
                    </div>
                    

					<!-- Buttons  -->
					<div class="modal-action">
						<button class="btn" on:click={closeModal}> Close </button>
						<button class={`btn btn-primary ${awaiting ? 'btn-disabled' : ''}`} on:click={login}>
							{#if awaiting}<span class="loading loading-spinner" />{/if}
							Login
						</button>
					</div>
				</div>
			</div>
        </div>
		{:else}
        <div transition:fade>
			<h3 class="font-bold text-lg">Account</h3>
			<p class="py-4">You are logged in as {username}</p>
			<!-- Buttons  -->
			<div class="modal-action">
				<button class="btn" on:click={closeModal}> Close </button>
				<button class={`btn btn-primary ${awaiting ? 'btn-disabled' : ''}`} on:click={logout}> Logout </button>
			</div>
            </div>
		{/if}
	</div>
</div>