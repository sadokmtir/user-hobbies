import mongoose from 'mongoose';
import {BaseUserRepository} from '../BaseRepository.interface';
import {User as UserInterface} from '../../../domain/user/User.interface';
import {MongoBaseRepository} from './MongoRepository';
import UserModel from '../../../domain/user/User.schema';
import User from '../../../domain/user/User';
import logger from '../../logging/Logger';
import HttpException from '../../middleware/exceptions/HttpException';
import UserStreamTransformer from '../../stream/UserStreamTransformer';
import {UserNotFoundException} from '../../middleware/exceptions/UserExceptions';
import Hobby from "../../../domain/hobby/Hobby";
import {Hobby as HobbyInterface} from "../../../domain/hobby/Hobby.interface";

export class UserRepository implements BaseUserRepository {
    private mongoBaseRepo: MongoBaseRepository<User>;

    constructor() {
        //@todo: add dependency injection
        this.mongoBaseRepo = new MongoBaseRepository<UserInterface>(UserModel);
    }

    public async findById(userId: string): Promise<UserInterface> {
        this.validateUserIdOrThrow(userId);
        let hobbies = [];
        const userData = await this.mongoBaseRepo.findById(userId).populate('hobbies');

        if (!userData) {
            throw UserNotFoundException;
        }

        if (userData.hobbies && userData.hobbies.length > 0) {
            hobbies = userData.hobbies.map((hobby: HobbyInterface) => Hobby.create(hobby.name, hobby.passionLevel, hobby.year));
        }
        return User.hydrate(userData._id, userData.name, hobbies);
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

    public async update(user: User) {
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

    public async save(user: User) {
        await UserModel.updateOne({_id: user._id}, {$addToSet: {hobbies: {$each: user.hobbies.map(hobby => hobby._id)}}});
    }

    private validateUserIdOrThrow(userId: string): void {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw UserNotFoundException;
        }
    }
}