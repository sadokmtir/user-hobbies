import mongoose from 'mongoose';
import {Readable} from 'stream';
import {BaseRepository} from '../BaseRepository.interface';
import {MongoBaseRepository} from './MongoRepository';
import HttpException from '../../middleware/exceptions/HttpException';
import {Hobby as HobbyInterface} from '../../../domain/hobby/Hobby.interface';
import Hobby from '../../../domain/hobby/Hobby';
import hobbyModel from '../../../domain/hobby/hobby.schema';

export class HobbyRepository implements BaseRepository<HobbyInterface> {
    private mongoBaseRepo: MongoBaseRepository<HobbyInterface>;

    constructor() {
        //@todo: add dependency injection
        this.mongoBaseRepo = new MongoBaseRepository<HobbyInterface>(hobbyModel);
    }

    public async create(hobby: Hobby): Promise<void> {
        try {
            await this.mongoBaseRepo.create(hobby);
        } catch (error) {
            if (error.message.indexOf('duplicate key error') !== -1) {
                throw new HttpException(400, 'Hobby already exists');
            }
            throw error;
        }
    }

    public async delete(userId: string) {
        // this.validateUserIdOrThrow(userId);
        // const result = await this.mongoBaseRepo.delete(userId);
        // if (result.deletedCount === 0) {
        //     throw UserNotFoundException;
        // }
    }

    findById: (id: string) => Promise<Hobby>;
    get: () => Readable;
    save: (item: Hobby) => Promise<void>;
    update: (item: Hobby) => Promise<void>;
}