import * as mongoose from 'mongoose';

export abstract class MongoBaseRepository<T extends { _id: string }> {

    private _model: mongoose.Model<mongoose.Document>;

    protected constructor(schemaModel: mongoose.Model<mongoose.Document>) {
        this._model = schemaModel;
    }

    async create(item: T): Promise<void> {
        await this._model.create(item);
    }

    async update(item: T): Promise<void> {
        await this._model.update({id: item._id}, item);
    }

    async delete(item: T): Promise<void> {
        await this._model.remove({id: item._id});
    }

    async findById(id: string): Promise<any> {
        await this._model.findById(id);
    }

    async findOne(cond?: Record<string, any>) {
        return await this._model.findOne(cond);
    }

    async find(cond?: Record<string, any>, fields?: Record<string, any>, options?: Record<string, any>): Promise<any> {
        return await this._model.find(cond, options);
    }

    private toObjectId(id: string): mongoose.Types.ObjectId {
        return mongoose.Types.ObjectId.createFromHexString(id);
    }

}