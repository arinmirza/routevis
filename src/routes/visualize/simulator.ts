import type { LatLngTuple } from 'leaflet';

export class Simulator {
	readonly waypoints: LatLngTuple[];
	readonly arrivals: number[];

	constructor(waypoints: LatLngTuple[] | undefined, arrivals: number[] | undefined) {
		console.log(waypoints, arrivals);
		this.waypoints = waypoints ?? [];
		this.arrivals = arrivals ?? [];
	}

	getPosition(currentTime: number) {
		const findArc = (currentTime: number) => {
			const idx = this.arrivals.findIndex((time) => currentTime < time);
			if (idx == -1 || idx == this.waypoints.length) {
				const lastNode = this.waypoints[this.waypoints.length - 1];
				const beginTime = this.arrivals[this.arrivals.length - 1];
				const endTime = beginTime;
				return { prev: lastNode, next: lastNode, beginTime, endTime };
			}
			const prev = this.waypoints[idx - 1];
			const next = this.waypoints[idx];
			const beginTime = this.arrivals[idx - 1];
			const endTime = this.arrivals[idx];
			return { prev, next, beginTime, endTime };
		};

		const completionRatio = (currentTime: number, beginTime: number, endTime: number) => {
			if (endTime - beginTime == 0) return 1;
			return (currentTime - beginTime) / (endTime - beginTime);
		};

		const slide = (prev: LatLngTuple, next: LatLngTuple, ratio: number) => {
			const pos_lat = prev[0] * (1 - ratio) + next[0] * ratio;
			const pos_lng = prev[1] * (1 - ratio) + next[1] * ratio;
			return [pos_lat, pos_lng] as LatLngTuple;
		};

		if (
			//this.waypoints.length === 0 ||
			//this.arrivals.length === 0 ||
			this.waypoints?.[0] === undefined ||
			this.arrivals?.[0] === undefined
		) {
			console.log('not computing position ');
			return [0, 0] as LatLngTuple;
		}

		const { prev, next, beginTime, endTime } = findArc(currentTime);
		return slide(prev, next, completionRatio(currentTime, beginTime, endTime));
	}
}
