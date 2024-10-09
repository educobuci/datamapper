import * as fs from 'fs'
import * as path from 'path'

import { Pool } from 'pg'

import { SelectQueryBuilder } from '../../src/select-query-builder'
import { DatabaseConnection } from '../../src/ports'
import { Codable, PostgresConnection, QueryFactory } from '../../src'
import { DataMapper } from '../../src/index'
import { UpdateQueryBuilder } from '../../src/update-query-builder'
import { InsertQueryBuilder } from '../../src/insert-query-builder'
import { DataCoder } from '../../src/encoding/data-coder'

export interface Product {
  id: number
  createdAt: Date
  name: string
  description: string
  price: number
  images: string[]
  category: string
  archived: boolean
  firstImage: string
}

const coder = new DataCoder<Product>({
  codingKeys: [
    'id',
    'archived',
    { createdAt: 'created_at' },
    'category',
    'description',
    'images',
    'name',
    'price',
  ],
})

const config = { tableName: 'products' }

export class ProductMapper extends DataMapper<Product> {
  constructor(connection: DatabaseConnection) {
    super({
      createInsertQuery: () =>
        new InsertQueryBuilder(connection, config, coder),
      createUpdateQuery: () =>
        new UpdateQueryBuilder(connection, config, coder),
      createSelectQuery: () =>
        new SelectQueryBuilder(
          connection,
          config,
          new DataCoder({
            decode: ({ images, created_at, ...other }) =>
              ({
                ...other,
                createdAt: created_at,
                images: images?.map(
                  (image: string) => `https://acme.com/${image}`
                ),
                firstImage: `https://acme.com/${images?.[0]}`,
              } as Product),
          })
        ),
    })
  }
}

type Currency = 'USD' | 'BRL' | 'EUR'

export class Money {
  amount: number
  currency: Currency
  constructor(amount: number, currency: Currency) {
    this.amount = amount
    this.currency = currency
  }
  toUnit() {
    return this.amount / 100
  }
}

export interface MoneyProduct {
  id: number
  name: string
  price: Money
  createdAt: Date
}

export function queryFactory<T extends { id: number }>(
  connection: DatabaseConnection,
  codable: Codable<T>
): QueryFactory<T> {
  return {
    createSelectQuery() {
      return new SelectQueryBuilder<T>(
        connection,
        config,
        new DataCoder(codable)
      )
    },
    createInsertQuery() {
      return new InsertQueryBuilder(connection, config, new DataCoder(codable))
    },
    createUpdateQuery() {
      return new UpdateQueryBuilder(connection, config, new DataCoder(codable))
    },
  }
}

export class Database {
  private pool: Pool
  readonly connection: DatabaseConnection

  constructor() {
    this.pool = new Pool({ user: 'postgres', port: 15432 })
    this.connection = new PostgresConnection(this.pool)
  }

  async setup() {
    await this.pool.query('TRUNCATE products RESTART IDENTITY')
    const fixture = path.join(
      __dirname,
      '../support/datamapper-test-fixture.sql'
    )
    const text = fs.readFileSync(fixture, 'utf-8')
    await this.pool.query({ text })
  }

  async end() {
    return this.pool.end()
  }
}
