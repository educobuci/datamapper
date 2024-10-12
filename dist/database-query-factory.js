import { DataCoder, InsertQueryBuilder, SelectQueryBuilder, UpdateQueryBuilder, } from '.';
class DatabaseQueryFactory {
    mappingOptions;
    coder;
    connection;
    constructor(connection, mappingOptions, codable) {
        this.connection = connection;
        this.mappingOptions = mappingOptions;
        this.coder = new DataCoder(codable);
    }
    createSelectQuery() {
        return new SelectQueryBuilder(this.connection, this.mappingOptions, this.coder);
    }
    createInsertQuery() {
        return new InsertQueryBuilder(this.connection, this.mappingOptions, this.coder);
    }
    createUpdateQuery() {
        return new UpdateQueryBuilder(this.connection, this.mappingOptions, this.coder);
    }
}
export { DatabaseQueryFactory };
//# sourceMappingURL=database-query-factory.js.map