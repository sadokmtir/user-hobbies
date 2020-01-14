import * as mongoose from 'mongoose';
import {User} from './User.interface';

const userSchema = new mongoose.Schema({
    author: String,
    content: String,
    title: String,
});

const UserModel = mongoose.model<User & mongoose.Document>('user', userSchema);

export default UserModel;
