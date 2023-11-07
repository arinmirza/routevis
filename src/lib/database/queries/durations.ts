import { list } from '$lib/utils';

export class DurationsQuery {
	readonly _username: string;
	readonly _supabase: MySupabaseClient;

	constructor(supabase: MySupabaseClient, username: string) {
		this._supabase = supabase;
		this._username = username;
	}

	async all() {
		const { data, error } = await this._supabase.from('durations').select();
		error && console.error('DurationsQuery:', error);
		return list(data).map(x => x.json)
	}
}
