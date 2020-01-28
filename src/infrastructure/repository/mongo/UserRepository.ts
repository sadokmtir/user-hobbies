import mongoose from 'mongoose';
import {BaseUserRepository} from '../BaseRepository.interface';
import {User as UserInterface} from '../../../domain/user/User.interface';
import {MongoBaseRepository} from './MongoRepository';
import UserModel from '../../../domain/user/User.schema';
import User from '../../../domain/user/User';
import logger from '../../logging/Logger';
import HttpException from '../../middleware/exceptions/HttpException';
import UserStreamTransformer from '../../stream/UserStreamTransformer';
import {UserIdNotValidException, UserNotFoundException} from '../../middleware/exceptions/UserExceptions';
import Hobby from '../../../domain/hobby/Hobby';

export class UserRepository implements BaseUserRepository {
    private mongoBaseRepo: MongoBaseRepository<User>;

    constructor() {
        //@todo: I can add dependency injection here, so I can modify in one place the dependency here we have mongo but it could
        // be mysql, in-memory ...
        this.mongoBaseRepo = new MongoBaseRepository<UserInterface>(UserModel);
    }

    public async findById(userId: string): Promise<UserInterface> {
        this.validateUserIdOrThrow(userId);
        let hobbies = [];
        const userData = await this.mongoBaseRepo.findById(mongoose.Types.ObjectId(userId)).populate('hobbies');

        if (!userData) {
            throw UserNotFoundException;
        }

        if (userData.hobbies && userData.hobbies.length > 0) {
            hobbies = userData.hobbies.map((hobby: Hobby & mongoose.Document) =>
                Hobby.hydrate(hobby._id, hobby.name, hobby.passionLevel, hobby.year));
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
        const result = await this.mongoBaseRepo.delete(mongoose.Types.ObjectId(userId));
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
        return this.mongoBaseRepo.get().populate('hobbies')
            .cursor()
            .on('error', (error) => {
                logger.error(`Error while getting the cursor stream: ${error.message}`);
                JsonStream.end();
            })
            .pipe(JsonStream);
    }

    public async save(user: User) {
        await UserModel.updateOne({_id: user._id}, {$set: {hobbies: user.hobbies.map(hobby => hobby._id)}});
    }

    private validateUserIdOrThrow(userId: string | mongoose.Types.ObjectId): void {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw UserIdNotValidException;
        }
    }
}