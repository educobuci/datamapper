import { mock } from 'vitest-mock-extended'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { vitest } from 'vitest'

import { DatabaseConnection } from '../../src/ports'
import { Coder } from '../../src/encoding/ports'
import { TableConfig } from '../../src/ports'
import { InsertQueryBuilder } from '../../src/insert-query-builder'
import { QueryAST } from '../../src/query-ast'

interface Point {
  id: number
  x: number
  y: number
  z: number
}

const config: TableConfig<Point> = {
  tableName: 'points',
  primaryKey: { column: 'id', autoIncrement: true },
}

describe('Insert Query Builder', () => {
  it('should encode the record', async () => {
    const builder = new InsertQueryBuilder(connection, config, coder)
    await builder.insert({ x: 1, y: 2, z: 3 })
    expect(coder.encode).toBeCalledWith({ x: 1, y: 2, z: 3 })
  })

  it('should build and execute the AST insert query', async () => {
    const builder = new InsertQueryBuilder(connection, config, coder)
    await builder.insert({ x: 1, y: 2 })
    const ast: QueryAST = {
      insert: { into: 'points', values: { x: 1, y: 2 } },
    }
    expect(connection.query).toHaveBeenCalledWith(ast)
  })

  it('should encode and return the record', async () => {
    const point = mock<Point>()
    coder.decode.mockReturnValue(point)
    const builder = new InsertQueryBuilder(connection, config, coder)
    const updated = await builder.insert({ x: 2, y: 3 })
    expect(updated).toEqual(point)
  })

  const connection = mock<DatabaseConnection>()
  const coder = mock<Coder<Point>>()
  coder.encode.mockImplementation((obj) => obj)

  beforeEach(() => {
    connection.query.mockResolvedValueOnce([])
  })

  afterEach(() => {
    vitest.clearAllMocks()
  })
})
