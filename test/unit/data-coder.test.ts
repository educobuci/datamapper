import { DataCoder } from '../../src/encoding/data-coder'

interface Product { id: number, name: string, price: number }

test('simple encoding', () => {
  const coder = new DataCoder<Product>()
  const encoded = coder.encode({ id: 1, name: 'iPhone', price: 999 })
  expect(encoded).toEqual({ id: 1, name: 'iPhone', price: 999 })
})

test('encoding keys', () => {
  const coder = new DataCoder<Product>({ codingKeys: ['id', 'price', { name: 'localized_name' }] })
  const encoded = coder.encode({ id: 1, name: 'iPhone', price: 999 })
  expect(encoded).toEqual({ id: 1, localized_name: 'iPhone', price: 999 })
})

test('auto camel-case conversion for encoding keys', () => {
  interface CameCaseType { camelCase: string }
  const coder = new DataCoder<CameCaseType>()
  const encoded = coder.encode({ camelCase: '123' })
  expect(encoded).toEqual({ camel_case: '123' })
})

test('decoding keys', () => {
  const coder = new DataCoder<Product>({ codingKeys: ['id', 'price', { name: 'localized_name' }] })
  const encoded = coder.decode({ id: 1, localized_name: 'iPhone', price: 999 })
  expect(encoded).toEqual({ id: 1, name: 'iPhone', price: 999 })
})

test('custom encoder', () => {
  const date = new Date()
  const coder = new DataCoder<Product>({ encode: ({ id, name, price }) => ({
    id, name, price, created_at: date
  })})
  const encoded = coder.encode({ id: 123, name: 'Arduino', price: 99 })
  expect(encoded).toEqual({ id: 123, name: 'Arduino', price: 99, created_at: date })
})

test('custom decoder', () => {
  type SearchableProduct = Product & { searchWords: string[] }
  const coder = new DataCoder<SearchableProduct>({ decode: ({ id, name, price }) => ({
    id, name, price,
    searchWords: [id, name, price].map(p => p.toString())
  })})
  const encoded = coder.decode({ id: 123, name: 'Arduino', price: 99 })
  expect(encoded).toEqual({ id: 123, name: 'Arduino', price: 99, searchWords: ['123', 'Arduino', '99'] })
})