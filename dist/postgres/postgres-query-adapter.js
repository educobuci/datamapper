export class PostgresQueryAdapter {
    buildSqlQueryConfig(ast) {
        if (ast.insert) {
            return this.buildInsertQuery(ast);
        }
        else if (ast.update) {
            return this.buildUpdateQuery(ast);
        }
        if (!ast.select) {
            throw new Error('Select query configuration is missing');
        }
        let text = `SELECT ${ast.select.columns.join(', ')} ` + `FROM ${ast.select.from}`;
        let values = [];
        if (ast.where) {
            if (ast.where._sql) {
                let sql = ast.where._sql[0];
                let index;
                let count = 1;
                while ((index = sql.indexOf('?')) >= 0) {
                    sql = sql.replace(/\?/, `$${count++}`);
                }
                text += ` WHERE ${sql}`;
                values = ast.where._sql.slice(1);
            }
            else {
                const where = Object.entries(ast.where)
                    .map(([key, value], i) => Array.isArray(value)
                    ? `${key} = ANY($${i + 1})`
                    : `${key} = $${i + 1}`)
                    .join(' AND ');
                text += ` WHERE ${where}`;
                values = Object.values(ast.where);
            }
        }
        if (ast.order) {
            const order = Array.isArray(ast.order)
                ? ast.order
                : Object.entries(ast.order).map(([key, ordering]) => ordering === 'asc' ? key : `${key} DESC`);
            text += ` ORDER BY ${order.join(', ')}`;
        }
        if (ast.offset) {
            values.push(ast.offset);
            text += ` OFFSET $${values.length}`;
        }
        if (ast.limit) {
            values.push(ast.limit);
            text += ` LIMIT $${values.length}`;
        }
        return { text, values };
    }
    buildInsertQuery(ast) {
        if (!ast.insert) {
            throw new Error('Insert query configuration is missing');
        }
        const text = `INSERT INTO ${ast.insert.into} ` +
            `(${Object.keys(ast.insert.values).join(', ')}) ` +
            `VALUES ` +
            `(${Object.values(ast.insert.values)
                .map((_, i) => `$${i + 1}`)
                .join(', ')}) ` +
            `RETURNING *`;
        const values = Object.values(ast.insert.values);
        return { text, values };
    }
    buildUpdateQuery(ast) {
        if (!ast.update) {
            throw new Error('Update query configuration is missing');
        }
        const tableName = Object.keys(ast.update)[0];
        const set = ast.update[tableName].set;
        const values = [
            ...Object.values(set),
            ...(ast.where ? Object.values(ast.where) : []),
        ];
        const text = `UPDATE ${tableName} ` +
            `SET ${Object.entries(set)
                .map(([k, _], i) => `${k} = $${i + 1}`)
                .join(', ')} ` +
            `WHERE ${ast.where
                ? Object.entries(ast.where)
                    .map(([key, _], i) => `${key} = $${i + Object.values(set).length + 1}`)
                    .join(' AND ')
                : ''} ` +
            `RETURNING *`;
        return { text, values };
    }
}
//# sourceMappingURL=postgres-query-adapter.js.map