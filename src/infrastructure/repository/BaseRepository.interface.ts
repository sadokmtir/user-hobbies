import {Readable} from 'stream';
import {User} from "../../domain/user/User.interface";
import {Hobby} from "../../domain/hobby/Hobby.interface";

export interface Read<T> {
    findById: (id: string) => Promise<T>;
    // findOne(cond?: Record<string, any>, callback?: (err: any, res: T) => void): mongoose.Query<T>;
    // find(cond: Object, fields: Object, options: Object, callback?: (err: any, res: T[]) => void): mongoose.Query<T[]>;
    get: () => Readable;
}

export interface Write<T> {
    create: (item: T) => Promise<void>;
    delete: (itemId: string) => Promise<void>;
    update: (item: T) => Promise<void>;
}

export interface BaseRepository<T> extends Read<T>, Write<T> {
}

export interface BaseUserRepository extends BaseRepository<User> {
    save: (user: User) => void;
}