import { Pool, types } from 'pg'
import { PostgresQueryAdapter } from '.'
import { DatabaseConnection } from '../ports'
import { QueryAST } from '../query-ast'

types.setTypeParser(1700, parseFloat)

export class PostgresConnection implements DatabaseConnection {
  pool: Pool
  queryAdapter: PostgresQueryAdapter
  
  constructor(pool: Pool) {
    this.pool = pool
    this.queryAdapter = new PostgresQueryAdapter()
  }

  async query(queryAST: QueryAST): Promise<any[]> {
    const config = this.queryAdapter.buildSqlQueryConfig(queryAST)
    const result = await this.pool.query(config)
    return result.rows
  }
}