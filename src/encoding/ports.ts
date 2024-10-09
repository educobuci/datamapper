export type CodingKey<T> = { [key in keyof Partial<T>] : string } | keyof T & string

export type Encode<T> = (obj: Partial<T>) => { [key: string]: any }

export type Decode<T> = (data: { [key: string]: any }) => T

export interface Codable<T> {
  encode?: Encode<T>
  decode?: Decode<T>
  codingKeys?: CodingKey<T>[]
}

export interface Encoder<T> {
  encode: Encode<T>
}

export interface Decoder<T> {
  decode: Decode<T>
}

export type Coder<T> = Encoder<T> & Decoder<T>