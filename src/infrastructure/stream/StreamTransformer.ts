import {Transform, TransformCallback} from 'stream';

export default abstract class JsonTransformer<T extends { toJson: Function }> extends Transform {
    private index: number;

    constructor() {
        super({writableObjectMode: true});
        this.index = 0;
    }

    abstract serialize(data: T): string;

    _transform(data: any, encoding: string, done: TransformCallback) {
        if (!(this.index++)) {
            this.push('[');
        } else {
            this.push(',');
        }
        this.push(this.serialize(data));
        done();
    }

    _flush(done: TransformCallback) {
        if (!(this.index++)) {
            this.push('[]');
        } else {
            this.push(']');
        }
        done();
    }
}
