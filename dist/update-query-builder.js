export class UpdateQueryBuilder {
    config;
    coder;
    connection;
    constructor(connection, config, coder) {
        this.config = config;
        this.coder = coder;
        this.connection = connection;
    }
    async update(record) {
        const { id, ...encoded } = this.coder.encode(record);
        const set = this.removeNulls(encoded);
        const ast = {
            update: { [this.config.tableName]: { set } },
            where: { id },
        };
        const row = (await this.connection.query(ast))[0];
        return this.coder.decode(row);
    }
    removeNulls(obj) {
        return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v));
    }
}
//# sourceMappingURL=update-query-builder.js.map