import {Hobby} from '../hobby/Hobby.interface';

export interface User {
    name: string;
    hobbies: Hobby[];
    _id: string;
    toJson: () => string;
    changeName: (newUserName: string) => void;
    addHobby: (hobby: Hobby) => void;
}
