export interface MappingOptions<T> {
    tableName: string;
    override?: {
        [key in keyof Partial<T>]: (row: any) => T[key];
    };
    encode?(record: Partial<T>): any;
}
//# sourceMappingURL=mapping-options.d.ts.map