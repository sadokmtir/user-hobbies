import mongoose from 'mongoose';
import {PassionLevel, Hobby as HobbyInterface} from './Hobby.interface';

// @Note: tried decoupling my core domain entities from the infra level as maximum as possible
export default class Hobby implements HobbyInterface {
    _id: mongoose.Types.ObjectId;
    passionLevel: string;
    name: string;
    year: number;

    public static create(name: string, passionLevel: string, year: number): Hobby {
        const id = new mongoose.Types.ObjectId();
        return new Hobby(id, passionLevel, name, year);
    }

    public static hydrate(id: mongoose.Types.ObjectId, name: string, passionLevel: string, year: number): Hobby {
        return new Hobby(id, passionLevel, name, year);
    }

    private constructor(id: mongoose.Types.ObjectId,
                        passionLevel: string,
                        name: string,
                        year: number,
    ) {

        // @ts-ignore
        if (!Object.values(PassionLevel).includes(passionLevel)) {
            throw new Error(`Violating domain condition: invalid value: ${passionLevel} for passionLevel`);
        }
        this._id = id;
        this.passionLevel = passionLevel;
        this.name = name;
        this.year = year;
    }
}
