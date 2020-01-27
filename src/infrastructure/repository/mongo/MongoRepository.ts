import mongoose, {DocumentQuery} from 'mongoose';
import {Readable} from 'stream';

export class MongoBaseRepository<T extends { _id: string }> {

    private _model: mongoose.Model<mongoose.Document>;

    public constructor(schemaModel: mongoose.Model<mongoose.Document>) {
        this._model = schemaModel;
    }

    async create(item: T): Promise<void> {
        await this._model.create(item);
    }

    async update(item: T): Promise<void> {

        const {_id: itemId, ...itemData} = item;
        await this._model.update({itemId}, itemData);
    }

    async delete(itemId: string) {
        return await this._model.remove({_id: itemId});
    }

     findById(id: string): T & DocumentQuery<any, any, any>  {
        // @ts-ignore
         return this._model.findById(id);
    }

    get(): Readable {
        return this._model.find().cursor();
    }

    // async findOne(cond?: Record<string, any>) {
    //     return await this._model.findOne(cond);
    // }
    //
    // async find(cond?: Record<string, any>, fields?: Record<string, any>, options?: Record<string, any>): Promise<any> {
    //     return await this._model.find(cond, options);
    // }
    //
    // private toObjectId(id: string): mongoose.Types.ObjectId {
    //     return mongoose.Types.ObjectId.createFromHexString(id);
    // }

}