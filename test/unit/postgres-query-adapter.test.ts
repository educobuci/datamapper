import { expect, test } from 'vitest'
import { PostgresQueryAdapter } from '../../src'
import { QueryAST } from '../../src/query-ast'

const adapter = new PostgresQueryAdapter()

test('select clause', () => {
  const ast: QueryAST = {
    select: { columns: ['id', 'name'], from: 'products' },
  }
  const config = adapter.buildSqlQueryConfig(ast)
  expect(config).toEqual({ text: 'SELECT id, name FROM products', values: [] })
})

test('where clause', () => {
  const ast: QueryAST = {
    select: { columns: ['*'], from: 'products' },
    where: { price: 100, archived: false },
  }
  const config = adapter.buildSqlQueryConfig(ast)
  expect(config).toEqual({
    text: 'SELECT * FROM products WHERE price = $1 AND archived = $2',
    values: [100, false],
  })
})

test('order by', () => {
  const ast: QueryAST = {
    select: { columns: ['*'], from: 'products' },
    order: { id: 'desc' },
  }
  const config = adapter.buildSqlQueryConfig(ast)
  expect(config).toEqual({
    text: 'SELECT * FROM products ORDER BY id DESC',
    values: [],
  })
})

test('where and order', () => {
  const ast: QueryAST = {
    select: { columns: ['*'], from: 'products' },
    where: { id: 1 },
    order: { id: 'desc' },
  }
  const config = adapter.buildSqlQueryConfig(ast)
  expect(config).toEqual({
    text: 'SELECT * FROM products WHERE id = $1 ORDER BY id DESC',
    values: [1],
  })
})

test('order by column', () => {
  const ast: QueryAST = {
    select: { columns: ['*'], from: 'products' },
    order: ['id', 'name'],
  }
  const config = adapter.buildSqlQueryConfig(ast)
  expect(config).toEqual({
    text: 'SELECT * FROM products ORDER BY id, name',
    values: [],
  })
})

test('offset and limit', () => {
  const ast: QueryAST = {
    select: { columns: ['*'], from: 'products' },
    offset: 10,
    limit: 5,
  }
  const config = adapter.buildSqlQueryConfig(ast)
  expect(config).toEqual({
    text: 'SELECT * FROM products OFFSET $1 LIMIT $2',
    values: [10, 5],
  })
})

test('where sql clause with parameter', () => {
  const ast: QueryAST = {
    select: { from: 'products', columns: ['*'] },
    where: { _sql: ['to_tsvector(products::text) @@ to_tsquery(?)', 'mac'] },
  }
  const config = adapter.buildSqlQueryConfig(ast)
  expect(config).toEqual({
    text: 'SELECT * FROM products WHERE to_tsvector(products::text) @@ to_tsquery($1)',
    values: ['mac'],
  })
})

test('insert query', () => {
  const ast: QueryAST = {
    insert: {
      into: 'products',
      values: { name: 'iMac', images: ['1.jpg', '2.jpg'] },
    },
  }
  const config = adapter.buildSqlQueryConfig(ast)
  expect(config).toEqual({
    text: 'INSERT INTO products (name, images) VALUES ($1, $2) RETURNING *',
    values: ['iMac', ['1.jpg', '2.jpg']],
  })
})

test('update query', () => {
  const ast: QueryAST = {
    update: {
      products: { set: { name: 'iPhone 13', description: 'New Model' } },
    },
    where: { id: 1, name: 'iPhone' },
  }
  const config = adapter.buildSqlQueryConfig(ast)
  expect(config).toEqual({
    text: 'UPDATE products SET name = $1, description = $2 WHERE id = $3 AND name = $4 RETURNING *',
    values: ['iPhone 13', 'New Model', 1, 'iPhone'],
  })
})

test('where in/any clause', () => {
  const ast: QueryAST = {
    select: { columns: ['*'], from: 'products' },
    where: { id: [1, 2, 3] },
  }
  const config = adapter.buildSqlQueryConfig(ast)
  expect(config).toEqual({
    text: 'SELECT * FROM products WHERE id = ANY($1)',
    values: [[1, 2, 3]],
  })
})
