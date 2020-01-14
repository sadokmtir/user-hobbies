import {BaseRepository} from '../BaseRepository.interface';
import {User as UserInterface} from '../../../domain/user/User.interface';
import {MongoBaseRepository} from './MongoRepository';
import UserModel from '../../../domain/user/User.schema';
import User from '../../../domain/user/User';

export class UserRepository extends MongoBaseRepository<UserInterface> implements BaseRepository<UserInterface> {
    constructor() {
        super(UserModel);
    }

    public async findById(id: string): Promise<User> {
        const userData = await super.findById(id);
        return User.hydrate(userData.id, userData.name, userData.hobbies ? userData.hobbies : []);
    }

    public async create(user: User): Promise<void> {
        await super.create(user);
    }

    public async delete(user: User): Promise<void> {
        await super.delete(user);
    }

    public async update(user: User) {
        await super.update(user);
    }

}