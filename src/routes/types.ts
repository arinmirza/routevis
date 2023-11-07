

export namespace My {
    
    // Coordinate related
    export type NamedLocation = [number, number, string]; // [lat, lng, name]
    export type LocationGroup = NamedLocation[];

    // Algorithm solution related
    export type SingleTour = number[];
    export type MultiTour = number[][];

    export type AlgorithmSolution = {
        algorithmParameters: any,
        totalDuration: number,
        longestTour: number,
        computationTime: number,
        solution: MultiTour[],
        arrivals: MultiTour[],
    }

}





