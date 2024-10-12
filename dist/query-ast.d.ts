export interface QueryAST {
    select?: {
        from: string;
        columns: string[];
    };
    insert?: {
        into: string;
        values: {
            [key: string]: any;
        };
    };
    update?: {
        [key: string]: {
            set: {
                [key: string]: any;
            };
        };
    };
    where?: {
        [key: string]: any | any[];
    };
    order?: {
        [key: string]: 'asc' | 'desc';
    } | string[];
    offset?: number;
    limit?: number;
}
//# sourceMappingURL=query-ast.d.ts.map