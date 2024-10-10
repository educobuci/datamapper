import { mock, MockProxy } from 'vitest-mock-extended'
import { Coder, SelectQuery } from '../../src'
import { DatabaseConnection } from '../../src/ports'
import { SelectQueryBuilder } from '../../src/select-query-builder'
import { QueryAST } from '../../src/query-ast'
import { Product } from '../support'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Query', () => {
  let connection: MockProxy<DatabaseConnection>
  let query: SelectQuery<Product>
  let coder: MockProxy<Coder<Product>>

  beforeEach(() => {
    connection = mock<DatabaseConnection>()
    connection.query.mockResolvedValueOnce([{}])
    coder = mock<Coder<Product>>()
    coder.encode.mockImplementation((clause) => clause)
    query = new SelectQueryBuilder<Product>(
      connection,
      { tableName: 'products' },
      coder,
    )
  })

  it('should allow selecting specific columns', async () => {
    const ast: QueryAST = {
      select: { from: 'products', columns: ['id', 'price'] },
    }
    await query.select('id', 'price').toArray()
    expect(connection.query).toHaveBeenCalledWith(ast)
  })

  it('should build the select all (*) query', async () => {
    const ast: QueryAST = {
      select: { from: 'products', columns: ['*'] },
    }
    await query.select('*').toArray()
    expect(connection.query).toHaveBeenCalledWith(ast)
  })

  it('should build the where clause with object', async () => {
    const ast: QueryAST = {
      select: { from: 'products', columns: ['*'] },
      where: { id: 1, price: 999 },
    }
    await query.select('*').where({ id: 1, price: 999 }).toArray()
    expect(connection.query).toHaveBeenCalledWith(ast)
  })

  it('should build the order by clause', async () => {
    const ast: QueryAST = {
      select: { from: 'products', columns: ['*'] },
      order: { id: 'desc' },
    }
    await query.select('*').order({ id: 'desc' }).toArray()
    expect(connection.query).toHaveBeenCalledWith(ast)
  })

  it('should build the order clause by property asc (default)', async () => {
    const ast: QueryAST = {
      select: { columns: ['*'], from: 'products' },
      order: ['id', 'name'],
    }
    await query.select('*').order('id', 'name').toArray()
    expect(connection.query).toHaveBeenCalledWith(ast)
  })

  it('should combine all query clauses', async () => {
    const ast: QueryAST = {
      select: { from: 'products', columns: ['*'] },
      where: { id: 1, price: 999 },
      order: { id: 'desc' },
    }
    await query
      .select('*')
      .where({ id: 1, price: 999 })
      .order({ id: 'desc' })
      .toArray()
    expect(connection.query).toHaveBeenCalledWith(ast)
  })

  it('should allow offseting and limiting', async () => {
    const ast: QueryAST = {
      select: { from: 'products', columns: ['*'] },
      offset: 0,
      limit: 10,
    }
    await query.select('*').offset(0).limit(10).toArray()
    expect(connection.query).toHaveBeenCalledWith(ast)
  })

  it('should return the total count or rows', async () => {
    const conn = mock<DatabaseConnection>()
    conn.query.mockResolvedValueOnce([{ count: 10 }])
    const countQuery = new SelectQueryBuilder(
      conn,
      { tableName: 'products' },
      coder,
    )
    const ast: QueryAST = {
      select: { from: 'products', columns: ['COUNT(*)'] },
      where: { archived: false },
    }
    const count = await countQuery.select('*').where({ archived: false }).count
    expect(conn.query).toHaveBeenCalledWith(ast)
    expect(count).toEqual(10)
  })

  it('should query by sql', async () => {
    const ast: QueryAST = {
      select: { from: 'products', columns: ['*'] },
      where: { _sql: ['to_tsvector(products::text) @@ to_tsquery(?)', 'mac'] },
    }
    await query
      .select('*')
      .where('to_tsvector(products::text) @@ to_tsquery(?)', 'mac')
      .toArray()
    expect(connection.query).toHaveBeenCalledWith(ast)
  })

  it('should call the decoder before returing the record', async () => {
    const prodMock = mock<Product>()
    coder.decode.mockReturnValueOnce(prodMock)
    const prod = (await query.select('*').toArray())[0]
    expect(prod).toEqual(prodMock)
  })

  it('should allow WHERE [column] IN clouses', async () => {
    const ast: QueryAST = {
      select: { from: 'products', columns: ['*'] },
      where: { id: [1, 2, 3] },
    }
    await query
      .select('*')
      .where({ id: [1, 2, 3] })
      .toArray()
    expect(connection.query).toHaveBeenCalledWith(ast)
  })
})
