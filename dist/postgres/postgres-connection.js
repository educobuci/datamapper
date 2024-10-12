import { types } from 'pg';
import { PostgresQueryAdapter } from '.';
types.setTypeParser(1700, parseFloat);
export class PostgresConnection {
    pool;
    queryAdapter;
    constructor(pool) {
        this.pool = pool;
        this.queryAdapter = new PostgresQueryAdapter();
    }
    async query(queryAST) {
        const config = this.queryAdapter.buildSqlQueryConfig(queryAST);
        const result = await this.pool.query(config);
        return result.rows;
    }
}
//# sourceMappingURL=postgres-connection.js.map