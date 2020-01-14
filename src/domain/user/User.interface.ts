import {Hobby} from '../hobby/Hobby.interface';

export interface User {
    name: string;
    hobbies: Hobby[];
    _id: string;
}
