import type { LocationGroup, MapLocation } from '$lib/types/map';
import { list } from '$lib/utils';

export class LocationsQuery {
	readonly _username: string;
	readonly _supabase: MySupabaseClient;

	constructor(supabase: MySupabaseClient, username: string) {
		this._supabase = supabase;
		this._username = username;
	}

	async all() {
		const { data, error } = await this._supabase.from('locations').select();
		error && console.error('LocationsQuery:', error);
		return list(data).map(x => ({...x, locations: x.locations as MapLocation[]}));
	}
}
