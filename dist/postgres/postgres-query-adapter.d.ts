import { QueryConfig } from 'pg';
import { QueryAST } from '../query-ast';
export declare class PostgresQueryAdapter {
    buildSqlQueryConfig(ast: QueryAST): QueryConfig;
    private buildInsertQuery;
    private buildUpdateQuery;
}
//# sourceMappingURL=postgres-query-adapter.d.ts.map