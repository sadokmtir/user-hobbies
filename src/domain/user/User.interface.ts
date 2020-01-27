import {Hobby} from '../hobby/Hobby.interface';
import mongoose from 'mongoose';

export interface User {
    name: string;
    hobbies: Hobby[];
    _id: mongoose.Types.ObjectId;
    toJson: () => string;
    changeName: (newUserName: string) => void;
    addHobby: (hobby: Hobby) => void;
    deleteHobby: (hobbyId: string) => void;
}
