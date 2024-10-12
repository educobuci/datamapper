import { QueryFactory, SelectQuery } from './ports';
export declare class DataMapper<T extends {
    id?: unknown;
}> {
    private queryFactory;
    constructor(queryFactory: QueryFactory<T>);
    get all(): SelectQuery<T>;
    save(record: Partial<T>): Promise<T>;
    find(id: unknown): Promise<T | null>;
    findBy(clause: {
        [key in keyof Partial<T>]: T[key] | Array<T[key]>;
    }): Promise<T | null>;
}
//# sourceMappingURL=data-mapper.d.ts.map