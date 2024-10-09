import { DatabaseConnection } from './ports'
import { QueryAST } from './query-ast'
import { Coder } from './encoding/ports'
import { TableConfig, UpdateQuery } from './ports'

export class UpdateQueryBuilder<T> implements UpdateQuery<T> {
  private config: TableConfig<T>
  private coder: Coder<T>
  private connection: DatabaseConnection

  constructor(
    connection: DatabaseConnection,
    config: TableConfig<T>,
    coder: Coder<T>,
  ) {
    this.config = config
    this.coder = coder
    this.connection = connection
  }

  async update(record: Partial<T>): Promise<T> {
    const { id, ...encoded } = this.coder.encode(record)
    const set = this.removeNulls(encoded)
    const ast: QueryAST = {
      update: { [this.config.tableName]: { set } },
      where: { id },
    }
    const row = (await this.connection.query(ast))[0]
    return this.coder.decode(row)
  }

  private removeNulls(obj: { [key: string]: unknown }) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v))
  }
}
