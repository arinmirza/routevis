export function validateRoutes(routes: any, totalLocations: number) {
	if (!Array.isArray(routes)) throw Error('Input must be an array of array of array of numbers!');
	for (const route of routes) {
		if (!Array.isArray(route)) throw Error('Input must be an array of array of array of numbers!');
		for (const tour of route) {
			if (!Array.isArray(tour)) throw Error('Input must be an array of array of array of numbers!');
			for (const node of tour) {
				if (!Number.isInteger(node)) throw Error('Values must be integers!');
				if (node >= totalLocations) {
					throw Error(`There is no location with index ${node}`);
				}
			}
		}
	}
}

export function validateLocations(places: any) {
    if (!Array.isArray(places)) throw Error('Input must be an array of [lat, lon, name] arrays.');
    for (const place of places) {
        if (!Array.isArray(place)) throw Error('Input must be an array of [lat, lon, name] arrays.');
        if (typeof place[0] !== 'number') throw Error('Latitute must be a dot separated number!');
        if (typeof place[1] !== 'number') throw Error('Longitude must be a dot separated number!');
        if (typeof place[2] !== 'string') throw Error('Place name must be a string!');
    }
}