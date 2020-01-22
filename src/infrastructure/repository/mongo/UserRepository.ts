import mongoose from 'mongoose';
import {BaseRepository} from '../BaseRepository.interface';
import {User as UserInterface} from '../../../domain/user/User.interface';
import {MongoBaseRepository} from './MongoRepository';
import UserModel from '../../../domain/user/User.schema';
import User from '../../../domain/user/User';
import logger from '../../logging/Logger';
import HttpException from '../../middleware/exceptions/HttpException';
import UserStreamTransformer from '../../stream/UserStreamTransformer';
import {UserNotFoundException} from '../../middleware/exceptions/UserException';

export class UserRepository implements BaseRepository<UserInterface> {
    private mongoBaseRepo: MongoBaseRepository<User>;

    constructor() {
        //@todo: add dependency injection
        this.mongoBaseRepo = new MongoBaseRepository<UserInterface>(UserModel);
    }

    public async findById(userId: string): Promise<UserInterface> {
        this.validateUserIdOrThrow(userId);
        const userData = await this.mongoBaseRepo.findById(userId);

        if (!userData) {
            throw UserNotFoundException;
        }
        return User.hydrate(userData.id, userData.name, userData.hobbies ? userData.hobbies : []);
    }

    public async create(user: User): Promise<void> {
        try {
            await this.mongoBaseRepo.create(user);
        } catch (error) {
            if (error.message.indexOf('duplicate key error') !== -1) {
                throw new HttpException(400, 'User already exists');
            }
            throw error;
        }
    }

    public async delete(userId: string) {
        this.validateUserIdOrThrow(userId);
        const result = await this.mongoBaseRepo.delete(userId);
        if (result.deletedCount === 0) {
            throw UserNotFoundException;
        }
    }

    public async update( user: User) {
        this.validateUserIdOrThrow(user._id);
        await this.mongoBaseRepo.update(user);
    }

    public get() {
        const JsonStream = new UserStreamTransformer();
        return this.mongoBaseRepo.get()
            .on('error', (error) => {
                logger.error(`Error while getting the cursor stream: ${error.message}`);
                JsonStream.end();
            })
            .pipe(JsonStream);
    }

    private validateUserIdOrThrow(userId: string): void {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw UserNotFoundException;
        }
    }
}