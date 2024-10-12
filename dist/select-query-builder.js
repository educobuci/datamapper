export class SelectQueryBuilder {
    connection;
    mappingOptions;
    ast = {};
    coder;
    constructor(connection, mappingOptions, coder) {
        this.connection = connection;
        this.mappingOptions = mappingOptions;
        this.coder = coder;
        this.ast = {};
    }
    select(...columns) {
        this.ast = {
            select: {
                from: this.mappingOptions.tableName,
                columns: columns.map((c) => c),
            },
        };
        return this;
    }
    where(clause, ...rest) {
        if (typeof clause === 'object') {
            this.ast.where = this.removeNulls(this.coder.encode(clause));
        }
        else {
            this.ast.where = { _sql: [clause, ...rest] };
        }
        return this;
    }
    order(by, ...rest) {
        if (typeof by === 'object') {
            this.ast.order = this.coder.encode(by);
        }
        else {
            const properties = [by, ...rest];
            const encoded = this.removeNulls(this.coder.encode(properties.reduce((obj, property) => {
                obj[property] = property;
                return obj;
            }, {})));
            this.ast.order = Object.keys(encoded);
        }
        return this;
    }
    offset(value) {
        this.ast.offset = value;
        return this;
    }
    limit(value) {
        this.ast.limit = value;
        return this;
    }
    async *[Symbol.asyncIterator]() {
        const rows = await this.connection.query(this.ast);
        for (const row of rows) {
            yield this.coder.decode(row);
        }
    }
    async toArray() {
        const items = [];
        for await (const item of this) {
            items.push(item);
        }
        return items;
    }
    get count() {
        if (!this.ast.select) {
            this.ast.select = { from: this.mappingOptions.tableName, columns: [] };
        }
        this.ast.select.columns = ['COUNT(*)'];
        return this.connection
            .query(this.ast)
            .then((rows) => parseInt(rows[0].count));
    }
    removeNulls(obj) {
        return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
    }
}
//# sourceMappingURL=select-query-builder.js.map