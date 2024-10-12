import { QueryAST } from './query-ast';
export interface SelectQuery<T> extends AsyncIterable<T> {
    select<Property extends keyof T>(...columns: Array<Property | string>): SelectQuery<T>;
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
    toArray(): Promise<Array<T>>;
    count: Promise<number>;
}
export interface InsertQuery<T> {
    insert(record: Partial<T>): Promise<T>;
}
export interface UpdateQuery<T> {
    update(record: Partial<T>): Promise<T>;
}
export interface TableConfig<T> {
    tableName: string;
    primaryKey?: {
        column: keyof T & string;
        autoIncrement: boolean;
    };
}
export interface QueryFactory<T> {
    createSelectQuery(): SelectQuery<T>;
    createInsertQuery(): InsertQuery<T>;
    createUpdateQuery(): UpdateQuery<T>;
}
export interface DatabaseConnection {
    query(queryAST: QueryAST): Promise<Array<any>>;
}
//# sourceMappingURL=ports.d.ts.map