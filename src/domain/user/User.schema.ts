import * as mongoose from 'mongoose';
import {User} from './User.interface';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    hobbies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hobby'
    }]

});

const UserModel = mongoose.model<User & mongoose.Document>('user', userSchema);

export default UserModel;
