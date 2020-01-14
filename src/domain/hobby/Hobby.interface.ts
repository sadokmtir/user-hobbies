export interface Hobby {
    id: string;
    passionLevel: PassionLevel;
    name: string;
    year: number;
}

export enum PassionLevel {
    Low = 'Low',
    medium = 'Medium',
    high = 'High',
    veryHigh = 'Very-High',
}
