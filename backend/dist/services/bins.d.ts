import type { Request } from 'express';
import type { CreateBinAPIResponse } from '../types/types.js';
export declare const createBin: (bin_route: unknown) => Promise<CreateBinAPIResponse>;
export declare const deleteBin: (binRoute: string, req: Request) => Promise<void>;
//# sourceMappingURL=bins.d.ts.map