import 'dotenv/config';
import { Bin, RequestRecord, RequestWithBody } from './postgres.js';
export interface RequestData {
    method: string;
    parameters: Record<string, unknown>;
    headers: Record<string, unknown>;
    body: unknown;
}
export type { Bin, RequestRecord, RequestWithBody };
declare const db: {
    init(): Promise<void>;
    close(): Promise<void>;
    bins: {
        create(bin_route: string, token: string): Promise<Bin>;
        getByRoute(bin_route: string): Promise<Bin | null>;
        getById(id: string): Promise<Bin | null>;
        delete(id: string): Promise<boolean>;
        deleteOlderThan(hours: number): Promise<number>;
    };
    requests: {
        create(bin_id: string, data: RequestData): Promise<RequestWithBody>;
        getByBinId(bin_id: string): Promise<RequestWithBody[]>;
        getById(id: string): Promise<RequestWithBody | null>;
        getByBinRoute(bin_route: string): Promise<RequestWithBody[]>;
        delete(id: string): Promise<boolean>;
    };
    pgPool: import("pg").Pool;
};
export default db;
//# sourceMappingURL=index.d.ts.map