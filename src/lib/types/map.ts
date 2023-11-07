export type MapLocation = { lat: number; lng: number; name?: string };

export type VehicleStop = MapLocation & { arrivalTime: number };
export type VehicleTour = VehicleStop[];
export type VehiclePlan = { capacity: number; tours: VehicleTour[] };

export type Solution = {
	id: number;
	name: string;
	description: string;
	vehicles: VehiclePlan[];
	locations: MapLocation[];
};

export type LocationGroup = {
	id: number;
	name: string;
	description: string;
	locations: MapLocation[];
};

export type DurationMatrix = {
	id: number;
	name: string;
	description: string;
	durations: number[][][];
};
