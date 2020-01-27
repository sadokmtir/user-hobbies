import mongoose, {DocumentQuery} from 'mongoose';

export class MongoBaseRepository<T extends { _id: mongoose.Types.ObjectId }> {

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

    async delete(itemId: mongoose.Types.ObjectId) {
        return await this._model.remove({_id: itemId});
    }

     findById(id: mongoose.Types.ObjectId): T & DocumentQuery<any, any, any>  {
        // @ts-ignore
         return this._model.findById(id);
    }

    get() {
        return this._model.find();
    }
}