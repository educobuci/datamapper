import {
  Codable,
  DataCoder,
  InsertQueryBuilder,
  QueryFactory,
  SelectQueryBuilder,
  UpdateQueryBuilder,
} from '.'
import { DatabaseConnection } from './ports'
import { MappingOptions } from './mapping-options'

class DatabaseQueryFactory<T> implements QueryFactory<T> {
  mappingOptions: MappingOptions<T>
  coder: DataCoder<T>
  connection: DatabaseConnection

  constructor(
    connection: DatabaseConnection,
    mappingOptions: MappingOptions<T>,
    codable: Codable<T>
  ) {
    this.connection = connection
    this.mappingOptions = mappingOptions
    this.coder = new DataCoder(codable)
  }

  createSelectQuery() {
    return new SelectQueryBuilder<T>(
      this.connection,
      this.mappingOptions,
      this.coder
    )
  }

  createInsertQuery() {
    return new InsertQueryBuilder<T>(
      this.connection,
      this.mappingOptions,
      this.coder
    )
  }

  createUpdateQuery() {
    return new UpdateQueryBuilder<T>(
      this.connection,
      this.mappingOptions,
      this.coder
    )
  }
}

export { DatabaseQueryFactory }
