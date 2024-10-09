import { QueryFactory, SelectQuery } from './ports'

export class DataMapper<T extends { id?: unknown }> {
  private queryFactory: QueryFactory<T>

  constructor(queryFactory: QueryFactory<T>) {
    this.queryFactory = queryFactory
  }

  get all(): SelectQuery<T> {
    return this.queryFactory.createSelectQuery().select('*')
  }

  async save(record: Partial<T>): Promise<T> {
    if (record.id) {
      return this.queryFactory.createUpdateQuery().update(record)
    } else {
      return this.queryFactory.createInsertQuery().insert(record)
    }
  }

  async find(id: unknown): Promise<T | null> {
    const records = await this.queryFactory
      .createSelectQuery()
      .select('*')
      .where('id = ?', id)
      .toArray()
    return records[0]
  }

  async findBy(clause: {
    [key in keyof Partial<T>]: T[key] | Array<T[key]>
  }): Promise<T | null> {
    const records = await this.queryFactory
      .createSelectQuery()
      .select('*')
      .where(clause)
      .toArray()
    if (!records.length) {
      return null
    }
    return records[0]
  }
}
