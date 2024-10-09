import inflection from 'inflection'
import { Codable, Coder } from './ports'

export class DataCoder<T> implements Coder<T> {
  private codable?: Codable<T>

  constructor(codable?: Codable<T>) {
    this.codable = codable
  }

  encode(object: Partial<T>): { [key: string]: any } {
    if (this.codable?.encode) {
      return this.codable?.encode(object)
    } else if (this.codable?.codingKeys) {
      return this.codable?.codingKeys.reduce((encoded: any, key) => {
        if (typeof key === 'string') {
          encoded[key] = object[key]
        } else {
          const [k, v] = Object.entries(key)[0]
          encoded[v as string] = object[k as keyof T]
        }
        return encoded
      }, {})
    }
    return Object.entries(object).reduce(
      (encoded: { [key: string]: unknown }, [key, value]) => {
        const newKey = inflection.underscore(key)
        encoded[newKey] = value
        return encoded
      },
      {},
    )
  }

  decode(data: { [key: string]: any }): T {
    if (this.codable?.decode) {
      return this.codable?.decode(data)
    } else if (this.codable?.codingKeys) {
      return this.codable?.codingKeys.reduce((decoded: any, key) => {
        if (typeof key === 'string') {
          decoded[key] = data[key]
        } else {
          const [k, v] = Object.entries(key)[0]
          decoded[k] = data[v as string]
        }
        return decoded
      }, {})
    } else {
      return data as T
    }
  }
}
