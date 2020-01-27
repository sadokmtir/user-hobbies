import JsonTransformer from './StreamTransformer';
import User from '../../domain/user/User';
import {User as UserInterface} from '../../domain/user/User.interface';
import Hobby from '../../domain/hobby/Hobby';
import mongoose from 'mongoose';

export default class UserStreamTransformer extends JsonTransformer<User> {
    constructor() {
        super();
    }

    serialize(data: UserInterface): string {
        let hobbies: Hobby[] = [];

        if (data.hobbies && data.hobbies.length > 0) {
            hobbies = data.hobbies.map((hobby: Hobby & mongoose.Document) =>
                Hobby.hydrate(hobby._id, hobby.name, hobby.passionLevel, hobby.year));
        }

        return User.hydrate(data._id, data.name, hobbies).toJson();
    }
}
