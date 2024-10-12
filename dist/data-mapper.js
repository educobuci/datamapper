export class DataMapper {
    queryFactory;
    constructor(queryFactory) {
        this.queryFactory = queryFactory;
    }
    get all() {
        return this.queryFactory.createSelectQuery().select('*');
    }
    async save(record) {
        if (record.id) {
            return this.queryFactory.createUpdateQuery().update(record);
        }
        else {
            return this.queryFactory.createInsertQuery().insert(record);
        }
    }
    async find(id) {
        const records = await this.queryFactory
            .createSelectQuery()
            .select('*')
            .where('id = ?', id)
            .toArray();
        return records[0];
    }
    async findBy(clause) {
        const records = await this.queryFactory
            .createSelectQuery()
            .select('*')
            .where(clause)
            .toArray();
        if (!records.length) {
            return null;
        }
        return records[0];
    }
}
//# sourceMappingURL=data-mapper.js.map