import * as mongoose from 'mongoose';
import {User} from './User.interface';
import {Schema} from "mongoose";

const userSchema = new mongoose.Schema({
    author: String,
    content: String,
    title: String,
    hobbies: [{
        type: Schema.Types.ObjectId,
        ref: 'hobby'
    }]

});

const UserModel = mongoose.model<User & mongoose.Document>('user', userSchema);

export default UserModel;
