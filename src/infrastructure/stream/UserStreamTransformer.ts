import JsonTransformer from './StreamTransformer';
import User from '../../domain/user/User';
import {User as UserInterface} from '../../domain/user/User.interface';

export default class UserStreamTransformer extends JsonTransformer<User> {
    constructor() {
        super();
    }

    serialize(data: UserInterface): string {
        return User.hydrate(data._id, data.name, data.hobbies).toJson();
    }
}
