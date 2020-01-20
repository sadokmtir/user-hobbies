import {TransformCallback, Transform} from "stream";

export default class JsonTransformer extends Transform {
    private _index: number;

    constructor() {
        super({writableObjectMode: true});
        this._index = 0;
    }

    _transform(data: any, encoding: string, done: TransformCallback) {
        if (!(this._index++)) {
            this.push('[');
        } else {
            this.push(',');
        }
        this.push(data);
        done();
    }

    _flush(done: TransformCallback) {
        if (!(this._index++)) {
            this.push('[]');
        } else {
            this.push(']');
        }
        done();
    }
}
