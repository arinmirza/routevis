// See https://kit.svelte.dev/docs/types#app

import type { Query } from "$lib/database/queries/query";
import type { Session } from "@supabase/supabase-js";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: MySupabaseClient;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
			query: Query;
		}
		// interface Locals {}
		// interface Platform {}
	}
}

export {};
