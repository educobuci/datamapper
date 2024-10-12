import { Coder } from './encoding/ports';
import { DatabaseConnection, InsertQuery, TableConfig } from './ports';
export declare class InsertQueryBuilder<T> implements InsertQuery<T> {
    private connection;
    private config;
    private coder;
    constructor(connection: DatabaseConnection, config: TableConfig<T>, coder: Coder<T>);
    insert(record: Partial<T>): Promise<T>;
    private removeNulls;
}
//# sourceMappingURL=insert-query-builder.d.ts.map