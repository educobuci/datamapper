import { mock, MockProxy } from 'jest-mock-extended'
import { DataMapper, QueryFactory, InsertQuery, UpdateQuery, SelectQuery } from '../../src'
import {  } from '../../src/'
import { Product } from '../support'

let queryFactory: MockProxy<QueryFactory<Product>>
let dataMapper: DataMapper<Product>

describe('DataMapper', () => {
  beforeEach(() => {
    queryFactory = mock<QueryFactory<Product>>()
    dataMapper = new DataMapper<Product>(queryFactory)
  })

  it('should create and return a record from a partial', async () => {
    const product = mock<Product>()
    const query = mock<InsertQuery<Product>>()
    query.insert.mockResolvedValueOnce(product)
    queryFactory.createInsertQuery.mockReturnValueOnce(query)
    expect(await dataMapper.save({ name: 'iPad' })).toEqual(product)
  })

  it('should update a record if the id is provided', async () => {
    const product = mock<Product>()
    const query = mock<UpdateQuery<Product>>()
    query.update.mockResolvedValueOnce(product)
    queryFactory.createUpdateQuery.mockReturnValueOnce(query)
    expect(await dataMapper.save({ id: 1, name: 'iPad' })).toEqual(product)
  })
})