import type { VehiclePlan, VehicleStop } from '$lib/types/map';
import type { LatLngTuple } from 'leaflet';

type Arc = { prev: VehicleStop, next: VehicleStop };

export class VehicleController {

	readonly waypoints: VehicleStop[];

	constructor(plan: VehiclePlan) {
		this.waypoints = plan.tours.flatMap(x => x);
	}

	/* Returns the current arc, given the current time. */
	getArc(currentTime: number): Arc {
		// Find the last position where arrival time < current time
		const idx = this.waypoints.findLastIndex(stop => currentTime >= stop.arrivalTime);
		console.info("idx=", idx);

		if (idx < 0) { 
			const prev = this.waypoints[0];
			const next = this.waypoints[1 % this.waypoints.length];
			return { prev, next };
		} 
		
		if (idx == this.waypoints.length) { 
			const prev = this.waypoints[this.waypoints.length - 1];
			const next = this.waypoints[this.waypoints.length - 1];
			return { prev, next };
		};

		const prev = this.waypoints[idx];
		const next = this.waypoints[(idx + 1) % this.waypoints.length];
		console.log("Current arc:", prev, next);
		return { prev, next };
	}


	/* Returns the completion ratio of the given arc, at the given time. */
	getCompletionRatio(arc: Arc, currentTime: number) {
		const beginTime = arc.prev.arrivalTime;
		const endTime = arc.next.arrivalTime;

		if (endTime - beginTime <= 0) { return 1; }
		return (currentTime - beginTime) / (endTime - beginTime);
	}

	/* Returns the current position of the vehicle, given the current time. */
	getPosition(currentTime: number) {

		const slide = (prev: VehicleStop, next: VehicleStop, ratio: number) => {
			const lat = prev.lat * (1 - ratio) + next.lat * ratio;
			const lng = prev.lng * (1 - ratio) + next.lng * ratio;
			return [lat, lng] as LatLngTuple;
		};

		const arc = this.getArc(currentTime);
		const ratio = this.getCompletionRatio(arc, currentTime);
		const position = slide(arc.prev, arc.next, ratio);

		return position;
	}
}
