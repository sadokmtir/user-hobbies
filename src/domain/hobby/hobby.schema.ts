import * as mongoose from 'mongoose';
import {Hobby} from './Hobby.interface';

const hobbySchema = new mongoose.Schema({
    passionLevel: String,
    name: String,
    year: Number,
});

const hobbyModel = mongoose.model<Hobby & mongoose.Document>('hobby', hobbySchema);

export default hobbyModel;
