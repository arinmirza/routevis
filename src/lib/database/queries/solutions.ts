import type { MapLocation, Solution, VehiclePlan } from '$lib/types/map';
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

		return list(data).map(row => {
			const solution: Solution = {
				id: row.id,
				name: row.name,
				created_at: row.created_at,
				description: row.description,
				owner: row.owner,
				vehicles: row.vehicles as VehiclePlan[],
				locations: row.locations as MapLocation[],
			};
			return solution;
		});
	}

}
