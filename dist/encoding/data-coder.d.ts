import { Codable, Coder } from './ports';
export declare class DataCoder<T> implements Coder<T> {
    private codable?;
    constructor(codable?: Codable<T>);
    encode(object: Partial<T>): {
        [key: string]: any;
    };
    decode(data: {
        [key: string]: any;
    }): T;
}
//# sourceMappingURL=data-coder.d.ts.map