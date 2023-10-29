

export namespace My {
    
    // Coordinate related
    export type LatLngLoc = [number, number, string];
    export type LocationSet = LatLngLoc[];

    // Algorithm solution related
    export type SingleTour = number[];
    export type MultiTour = number[][];

    export type AlgorithmSolution = {
        algorithmParameters: any,
        totalDuration: number,
        longestTour: number,
        computationTime: number,
        ignoredCustomers: number[],
        solution: MultiTour[],
        arrivals: MultiTour[],
    }

}






