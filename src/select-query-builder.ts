import { DatabaseConnection } from './ports'
import { MappingOptions } from './mapping-options'
import { QueryAST } from './query-ast'
import { SelectQuery } from './ports'
import { Coder } from '.'

export class SelectQueryBuilder<T> implements SelectQuery<T> {
  private connection: DatabaseConnection
  private mappingOptions: MappingOptions<T>
  private ast: QueryAST = {}
  private coder: Coder<T>

  constructor(
    connection: DatabaseConnection,
    mappingOptions: MappingOptions<T>,
    coder: Coder<T>,
  ) {
    this.connection = connection
    this.mappingOptions = mappingOptions
    this.coder = coder
    this.ast = {}
  }

  select<Property extends keyof T>(
    ...columns: (string | Property)[]
  ): SelectQuery<T> {
    this.ast = {
      select: {
        from: this.mappingOptions.tableName,
        columns: columns.map((c) => c as string),
      },
    }
    return this
  }

  where(clause: {
    [key in keyof Partial<T>]: T[key] | Array<T[key]>
  }): SelectQuery<T>
  where(clause: string, ...params: unknown[]): SelectQuery<T>
  where(clause: any, ...rest: any[]): SelectQuery<T> {
    if (typeof clause === 'object') {
      this.ast.where = this.removeNulls(this.coder.encode(clause))
    } else {
      this.ast.where = { _sql: [clause, ...rest] }
    }
    return this
  }

  order(by: { [key in keyof Partial<T>]: 'asc' | 'desc' }): SelectQuery<T>
  order<Property extends keyof T>(...by: Property[]): SelectQuery<T>
  order(by?: any, ...rest: any[]): SelectQuery<T> {
    if (typeof by === 'object') {
      this.ast.order = this.coder.encode(by)
    } else {
      const properties = [by, ...rest]
      const encoded = this.removeNulls(
        this.coder.encode(
          properties.reduce((obj, property) => {
            obj[property] = property
            return obj
          }, {}),
        ),
      )
      this.ast.order = Object.keys(encoded)
    }
    return this
  }

  offset(value: number): SelectQuery<T> {
    this.ast.offset = value
    return this
  }

  limit(value: number): SelectQuery<T> {
    this.ast.limit = value
    return this
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T, any, undefined> {
    const rows = await this.connection.query(this.ast)
    for (const row of rows) {
      yield this.coder.decode(row)
    }
  }

  async toArray(): Promise<Array<T>> {
    const items = []
    for await (const item of this) {
      items.push(item)
    }
    return items
  }

  get count(): Promise<number> {
    if (!this.ast.select) {
      this.ast.select = { from: this.mappingOptions.tableName, columns: [] }
    }
    this.ast.select.columns = ['COUNT(*)']
    return this.connection
      .query(this.ast)
      .then((rows) => parseInt(rows[0].count))
  }

  private removeNulls(obj: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined),
    )
  }
}
