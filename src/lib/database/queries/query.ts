import { DurationsQuery } from './durations';
import { LocationsQuery } from './locations';
import { SolutionsQuery } from './solutions';

export class Query {
	readonly _username: string;
	readonly _supabase: MySupabaseClient;

	readonly locations: InstanceType<typeof LocationsQuery>;
	readonly durations: InstanceType<typeof DurationsQuery>;
	readonly solutions: InstanceType<typeof SolutionsQuery>;

	constructor(supabase: MySupabaseClient, username: string) {
		this._supabase = supabase;
		this._username = username;
		this.locations = new LocationsQuery(supabase, username);
		this.durations = new DurationsQuery(supabase, username);
		this.solutions = new SolutionsQuery(supabase, username);
	}
}

export namespace Db {
	export type LocationSet = Awaited<ReturnType<InstanceType<typeof LocationsQuery>['all']>>[number];
	export type DurationMatrix = Awaited<ReturnType<InstanceType<typeof DurationsQuery>['all']>>[number];
	export type SolutionRecord = Awaited<ReturnType<InstanceType<typeof SolutionsQuery>['all']>>[number];
}






