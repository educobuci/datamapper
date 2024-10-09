import { Codable, DataMapper } from '../../src'
import {
  Product,
  Database,
  ProductMapper,
  MoneyProduct,
  queryFactory,
  Money,
} from '../support'

const database = new Database()
const Products = new ProductMapper(database.connection)

describe('Data Mapper', () => {
  beforeAll(async () => {
    await database.setup()
  })

  afterAll(async () => {
    await database.end()
  })

  it('should return all records of a type', async () => {
    const products = new Array<Product>()
    for await (const prod of Products.all.order('id')) {
      products.push(prod)
    }
    expect(products.length).toBe(6)
    expect(products[0]).toEqual<Product>({
      id: 1,
      name: 'Apple Watch Series 6',
      description: 'The most advanced Apple Watch yet',
      price: 449,
      images: [
        'https://acme.com/applewatch.jpg',
        'https://acme.com/applewatchbig.jpg',
      ],
      createdAt: new Date('2021-10-07 18:52:50-0000'),
      category: 'Watch',
      archived: false,
      firstImage: 'https://acme.com/applewatch.jpg',
    })
  })

  it('should allow querying and ordering', async () => {
    const query = Products.all
      .where({ price: 999, archived: false })
      .order({ id: 'desc' })
    const products = await query.toArray()
    expect(products.map((p) => p.id)).toEqual([5, 3])
  })

  it('should allow offsetting and limiting', async () => {
    const products = await Products.all.order('id').limit(2).offset(2).toArray()
    expect(products.map((p) => p.id)).toEqual([3, 4])
  })

  it('should allow counting', async () => {
    const count = await Products.all.where({ archived: false }).count
    expect(count).toEqual(5)
  })

  it('should query by sql', async () => {
    const products = await Products.all.where('id > ?', 3).order('id').toArray()
    expect(products.map((p) => p.id)).toEqual([4, 5, 6])
  })

  it('should created a record if the id is null', async () => {
    const date = new Date(2018, 6, 24)
    const prod: Partial<Product> = {
      archived: false,
      name: 'MacBook Pro 14 M1 Pro',
      price: 1999,
      category: 'Notebook',
      description: 'New MacBook with Apple M1 Pro',
      images: ['1.jpg'],
      createdAt: date,
    }
    const { id, ...prodRest } = await Products.save(prod)
    expect(id > 0).toBeTruthy()
    expect(prodRest).toEqual(prod)
  })

  it('should update a record if id is not null', async () => {
    const prod = (await Products.all.where({ id: 1 }).toArray())[0]
    prod.name = 'Apple Watch Series 7'
    await Products.save(prod)
    const checkProd = (await Products.all.where({ id: 1 }).toArray())[0]
    expect(checkProd.name).toEqual('Apple Watch Series 7')
  })

  it('should support custom coder', async () => {
    const codable: Codable<MoneyProduct> = {
      encode: ({ id, name, price }) => ({ id, name, price: price?.amount }),
      decode: (data) => ({
        id: data.id,
        name: data.name,
        price: new Money(data.price, 'USD'),
        createdAt: data.created_at,
      }),
    }
    const MoneyProducts = new DataMapper<MoneyProduct>(
      queryFactory(database.connection, codable)
    )
    const prod = await MoneyProducts.save({
      id: 1,
      name: 'Apple Watch Series 8',
      price: new Money(59900, 'USD'),
    })
    expect(prod.name).toEqual('Apple Watch Series 8')
    expect(prod.price.toUnit()).toEqual(599)
  })

  it('should allow finding a record by id', async () => {
    const prod = await Products.find(1)
    expect(prod.id).toEqual(1)
  })

  it('should allow querying a column by multiple values (WHERE IN/ANY)', async () => {
    const query = Products.all.where({ id: [1, 2, 3] })
    const products = await query.toArray()
    expect(products.map((p) => p.id)).toEqual([1, 2, 3])
  })

  it('should find one record by any column', async () => {
    const product = await Products.findBy({ name: 'Apple Watch Series 8' })
    expect(product.id).toEqual(1)
  })
})
