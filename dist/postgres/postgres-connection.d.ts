import { Pool } from 'pg';
import { PostgresQueryAdapter } from '.';
import { DatabaseConnection } from '../ports';
import { QueryAST } from '../query-ast';
export declare class PostgresConnection implements DatabaseConnection {
    pool: Pool;
    queryAdapter: PostgresQueryAdapter;
    constructor(pool: Pool);
    query(queryAST: QueryAST): Promise<any[]>;
}
//# sourceMappingURL=postgres-connection.d.ts.map