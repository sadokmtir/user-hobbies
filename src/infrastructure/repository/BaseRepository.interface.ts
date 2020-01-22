import {Readable} from "stream";

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