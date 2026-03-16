export interface Bin {
    id: string;
    bin_route: string;
    created_at: Date;
    token: string;
}
export interface RequestRecord {
    id: string;
    bin_id: string;
    method: string;
    parameters: Record<string, unknown>;
    headers: Record<string, unknown>;
    body_id: string;
    created_at: Date;
}
export interface RequestWithBody extends RequestRecord {
    body: unknown;
}
export declare function initTables(): Promise<void>;
export declare const binQueries: {
    create(bin_route: string, token: string): Promise<Bin>;
    getByRoute(bin_route: string): Promise<Bin | null>;
    getById(id: string): Promise<Bin | null>;
    delete(id: string): Promise<boolean>;
    getOlderThan(hours: number): Promise<Bin[]>;
};
export declare const requestQueries: {
    create(bin_id: string, method: string, parameters: Record<string, unknown>, headers: Record<string, unknown>, body_id: string): Promise<RequestRecord>;
    getByBinId(bin_id: string): Promise<RequestRecord[]>;
    getById(id: string): Promise<RequestRecord | null>;
    delete(id: string): Promise<boolean>;
    deleteByBinId(bin_id: string): Promise<number>;
    getBinsOlderThan(hours: number): Promise<Bin[]>;
};
//# sourceMappingURL=postgres.d.ts.map