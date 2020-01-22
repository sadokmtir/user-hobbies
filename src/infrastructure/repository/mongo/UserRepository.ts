import {BaseRepository} from '../BaseRepository.interface';
import {User as UserInterface} from '../../../domain/user/User.interface';
import {MongoBaseRepository} from './MongoRepository';
import UserModel from '../../../domain/user/User.schema';
import User from '../../../domain/user/User';
import JsonTransformer from '../../StreamTransformer';
import logger from '../../logging/Logger';
import HttpException from "../../middleware/exceptions/HttpException";

export class UserRepository extends MongoBaseRepository<UserInterface> implements BaseRepository<UserInterface> {
    constructor() {
        super(UserModel);
    }

    public async findById(id: string): Promise<UserInterface> {
        const userData = await super.findById(id);
        return User.hydrate(userData.id, userData.name, userData.hobbies ? userData.hobbies : []);
    }

    public async create(user: User): Promise<void> {
        try {
            await super.create(user);
        } catch (error) {
            if (error.message.indexOf('duplicate key error') !== -1) {
                throw new HttpException(400, 'User already exists');
            }
            throw error;
        }
    }

    public async delete(userId: string): Promise<void> {
        await super.delete(userId);
    }

    public async update(user: User) {
        await super.update(user);
    }

    public get() {
        const JsonStream = new JsonTransformer();
        return super.get()
            .on('error', (error) => {
                logger.error(`Error while getting the cursor stream: ${error.message}`);
                JsonStream.end();
            })
            .pipe(JsonStream);
    }

}