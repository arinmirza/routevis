export type MapLocation = { lat: number; lng: number; demand: number, name: string };

export type VehicleStop = { lat: number, lng: number, arrivalTime: number };
export type VehicleTour = VehicleStop[];
export type VehiclePlan = { capacity: number; tours: VehicleTour[] };

export type Solution = {
	id: number;
	name: string;
	description: string;
	created_at: string;
	owner: string;
	vehicles: VehiclePlan[];
	locations: MapLocation[];
};

export type LocationGroup = {
	id: number;
	name: string;
	description: string;
	created_at: string;
	owner: string;
	locations: MapLocation[];
};

export type DurationMatrix = {
	id: number;
	name: string;
	description: string;
	created_at: string;
	owner: string;
	matrix: number[][][];
};
