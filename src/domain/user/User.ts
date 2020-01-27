import {User as UserInterface} from './User.interface';
import {Hobby} from '../hobby/Hobby.interface';
import mongoose from 'mongoose';
import {HobbyExistsOnUser} from "../../infrastructure/middleware/exceptions/HobbyExceptions";

export default class User implements UserInterface {
    name: string;
    hobbies: Hobby[] = [];
    _id: string;

    private constructor(id: string, name: string, hobbies: Hobby[] = []) {
        this.name = name;
        this.hobbies = hobbies;
        this._id = id;
    }

    public static create(name: string, hobbies: Hobby[] = []): User {
        const id = new mongoose.Types.ObjectId().toHexString();
        return new User(id, name, hobbies);
    }

    public static hydrate(id: string, name: string, hobbies: Hobby[] = []): User {
        return new User(id, name, hobbies);
    }

    public changeName(newUserName: string) {
        this.name = newUserName;
    }

    public addHobby(hobby: Hobby) {

        if (this.hobbies.find(userHobby => userHobby.name === hobby.name)) {
            throw HobbyExistsOnUser;
        }
        this.hobbies.push(hobby);
    }


    public toJson() {
        return JSON.stringify(this);
    }
}