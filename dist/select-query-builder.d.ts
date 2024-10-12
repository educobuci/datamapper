import { DatabaseConnection } from './ports';
import { MappingOptions } from './mapping-options';
import { SelectQuery } from './ports';
import { Coder } from '.';
export declare class SelectQueryBuilder<T> implements SelectQuery<T> {
    private connection;
    private mappingOptions;
    private ast;
    private coder;
    constructor(connection: DatabaseConnection, mappingOptions: MappingOptions<T>, coder: Coder<T>);
    select<Property extends keyof T>(...columns: (string | Property)[]): SelectQuery<T>;
    where(clause: {
        [key in keyof Partial<T>]: T[key] | Array<T[key]>;
    }): SelectQuery<T>;
    where(clause: string, ...params: unknown[]): SelectQuery<T>;
    order(by: {
        [key in keyof Partial<T>]: 'asc' | 'desc';
    }): SelectQuery<T>;
    order<Property extends keyof T>(...by: Property[]): SelectQuery<T>;
    offset(value: number): SelectQuery<T>;
    limit(value: number): SelectQuery<T>;
    [Symbol.asyncIterator](): AsyncIterator<T, any, undefined>;
    toArray(): Promise<Array<T>>;
    get count(): Promise<number>;
    private removeNulls;
}
//# sourceMappingURL=select-query-builder.d.ts.map