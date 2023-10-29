import { list } from '$lib/utils';

export class SolutionsQuery {
	readonly _username: string;
	readonly _supabase: MySupabaseClient;

	constructor(supabase: MySupabaseClient, username: string) {
		this._supabase = supabase;
		this._username = username;
	}

	async all() {
		const { data, error } = await this._supabase.from('solutions').select();
		error && console.error('SolutionsQuery:', error);
		return list(data);
	}
}
