import { Codable, DataCoder, InsertQueryBuilder, QueryFactory, SelectQueryBuilder, UpdateQueryBuilder } from '.';
import { DatabaseConnection } from './ports';
import { MappingOptions } from './mapping-options';
declare class DatabaseQueryFactory<T> implements QueryFactory<T> {
    mappingOptions: MappingOptions<T>;
    coder: DataCoder<T>;
    connection: DatabaseConnection;
    constructor(connection: DatabaseConnection, mappingOptions: MappingOptions<T>, codable: Codable<T>);
    createSelectQuery(): SelectQueryBuilder<T>;
    createInsertQuery(): InsertQueryBuilder<T>;
    createUpdateQuery(): UpdateQueryBuilder<T>;
}
export { DatabaseQueryFactory };
//# sourceMappingURL=database-query-factory.d.ts.map