import { PassionLevel } from './Hobby.interface';

class Hobby {
    id: string;
    passionLevel: PassionLevel;
    name: string;
    year: number;

    constructor(id: string,
                passionLevel: PassionLevel,
                name: string,
                year: number,
    ) {
        this.id = id;
        this.passionLevel = passionLevel;
        this.name = name;
        this.year = year;
    }
}
