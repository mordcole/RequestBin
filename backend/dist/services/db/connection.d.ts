import { Pool } from 'pg';
export declare const pgPool: Pool;
export declare function connectMongo(): Promise<void>;
export declare function testPgConnection(): Promise<void>;
export declare function initDatabases(): Promise<void>;
export declare function closeDatabases(): Promise<void>;
//# sourceMappingURL=connection.d.ts.map