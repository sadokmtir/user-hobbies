import {User as UserInterface} from './User.interface';
import {Hobby} from '../hobby/Hobby.interface';
import mongoose from 'mongoose';
import {HobbyDoesNotExistOnUserException} from '../../infrastructure/middleware/exceptions/HobbyExceptions';

// @Note: tried decoupling my core domain entities from the infra level as maximum as possible
export default class User implements UserInterface {
    name: string;
    hobbies: Hobby[] = [];
    _id: mongoose.Types.ObjectId;

    private constructor(id: mongoose.Types.ObjectId, name: string, hobbies: Hobby[] = []) {
        this.name = name;
        this.hobbies = hobbies;
        this._id = id;
    }

    public static create(name: string, hobbies: Hobby[] = []): User {
        const id = new mongoose.Types.ObjectId();
        return new User(id, name, hobbies);
    }

    public static hydrate(id: mongoose.Types.ObjectId, name: string, hobbies: Hobby[] = []): User {
        return new User(id, name, hobbies);
    }

    public changeName(newUserName: string) {
        this.name = newUserName;
    }

    public addHobby(hobby: Hobby) {

        if (this.hobbies.find(userHobby => userHobby.name === hobby.name)) {
            throw HobbyDoesNotExistOnUserException;
        }
        this.hobbies.push(hobby);
    }

    public deleteHobby(hobbyId: string) {

        const hobbyIndex = this.hobbies.findIndex(hobby => hobby._id.toHexString() === hobbyId);

        if (hobbyIndex === -1) {
            throw HobbyDoesNotExistOnUserException;
        }
        this.hobbies.splice(hobbyIndex,  1);

    }

    public toJson() {
        return JSON.stringify(this);
    }
}