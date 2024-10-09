import { mock } from 'jest-mock-extended'
import { UpdateQueryBuilder } from '../../src/update-query-builder'
import { DatabaseConnection } from '../../src/ports'
import { TableConfig } from '../../src/ports'
import { Coder } from '../../src/encoding/ports'
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

describe('Update Query Builder', () => {
  const connection = mock<DatabaseConnection>()
  const coder = mock<Coder<Point>>()
  coder.encode.mockImplementation((obj) => obj)

  beforeEach(() => {
    connection.query.mockResolvedValueOnce([])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should encode the record', async () => {
    const builder = new UpdateQueryBuilder(connection, config, coder)
    await builder.update({ id: 1, x: 2, y: 3 })
    expect(coder.encode).toHaveBeenCalledWith({ id: 1, x: 2, y: 3 })
  })

  it('should build and execute the AST update query ommiting the primary key (id by default)', async () => {
    const builder = new UpdateQueryBuilder(connection, config, coder)
    await builder.update({ id: 1, x: 2, y: 3 })
    const ast: QueryAST = {
      update: { points: { set: { x: 2, y: 3 } } },
      where: { id: 1 },
    }
    expect(connection.query).toHaveBeenCalledWith(ast)
  })

  it('should encode and return the record', async () => {
    const point = mock<Point>()
    coder.decode.mockReturnValue(point)
    const builder = new UpdateQueryBuilder(connection, config, coder)
    const updated = await builder.update({ id: 1, x: 2, y: 3 })
    expect(updated).toEqual(point)
  })

  it('should remove the null or undefined values', async () => {
    const ast: QueryAST = {
      update: { points: { set: { y: 3 } } },
      where: { id: 1 },
    }
    const builder = new UpdateQueryBuilder(connection, config, coder)
    await builder.update({ id: 1, x: null, y: 3, z: undefined })
    expect(connection.query).toBeCalledWith(ast)
  })
})
