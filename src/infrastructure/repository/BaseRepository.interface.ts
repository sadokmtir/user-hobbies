import {Readable} from 'stream';
import {User} from '../../domain/user/User.interface';

export interface Read<T> {
    findById: (id: string) => Promise<T>;
    get: () => Readable;
}

export interface Write<T> {
    create: (item: T) => Promise<void>;
    delete: (itemId: string) => Promise<void>;
    update: (item: T) => Promise<void>;
}

//@Note: the idea behind this interface is to decouple the infra layer, so to say any database that implements
// this interface could basically work with our application, no coupling to Mongodb
export interface BaseRepository<T> extends Read<T>, Write<T> {
}

export interface BaseUserRepository extends BaseRepository<User> {
    save: (user: User) => void;
}