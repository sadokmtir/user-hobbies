export interface Hobby {
    _id: string;
    passionLevel: string;
    name: string;
    year: number;
}

export enum PassionLevel {
    Low = 'Low',
    medium = 'Medium',
    high = 'High',
    veryHigh = 'Very-High',
}
