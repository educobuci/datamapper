export class InsertQueryBuilder {
    connection;
    config;
    coder;
    constructor(connection, config, coder) {
        this.connection = connection;
        this.config = config;
        this.coder = coder;
    }
    async insert(record) {
        const values = this.removeNulls(this.coder.encode(record));
        const ast = { insert: { into: this.config.tableName, values } };
        const row = (await this.connection.query(ast))[0];
        return this.coder.decode(row);
    }
    removeNulls(obj) {
        return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v));
    }
}
//# sourceMappingURL=insert-query-builder.js.map