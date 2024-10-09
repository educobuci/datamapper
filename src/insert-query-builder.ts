import { Coder } from './encoding/ports'
import { DatabaseConnection, InsertQuery, TableConfig } from './ports'
import { QueryAST } from './query-ast'

export class InsertQueryBuilder<T> implements InsertQuery<T> {
  private connection: DatabaseConnection
  private config: TableConfig<T>
  private coder: Coder<T>

  constructor(
    connection: DatabaseConnection,
    config: TableConfig<T>,
    coder: Coder<T>,
  ) {
    this.connection = connection
    this.config = config
    this.coder = coder
  }

  async insert(record: Partial<T>): Promise<T> {
    const values = this.removeNulls(this.coder.encode(record))
    const ast: QueryAST = { insert: { into: this.config.tableName, values } }
    const row = (await this.connection.query(ast))[0]
    return this.coder.decode(row)
  }

  private removeNulls(obj: Record<string, unknown>) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v))
  }
}
