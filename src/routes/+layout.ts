import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { Query } from '$lib/database/queries/query';
import type { LayoutLoad } from './$types';

import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createSupabaseLoadClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_KEY,
		event: { fetch },
		serverSession: data.session
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	const query = new Query(supabase, session?.user.email ?? 'public');


	return { session, query };
};

//export const ssr = false;