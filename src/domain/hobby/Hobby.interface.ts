import mongoose from 'mongoose';

export interface Hobby {
    _id: mongoose.Types.ObjectId;
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
