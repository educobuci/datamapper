import { DatabaseConnection } from './ports';
import { Coder } from './encoding/ports';
import { TableConfig, UpdateQuery } from './ports';
export declare class UpdateQueryBuilder<T> implements UpdateQuery<T> {
    private config;
    private coder;
    private connection;
    constructor(connection: DatabaseConnection, config: TableConfig<T>, coder: Coder<T>);
    update(record: Partial<T>): Promise<T>;
    private removeNulls;
}
//# sourceMappingURL=update-query-builder.d.ts.map