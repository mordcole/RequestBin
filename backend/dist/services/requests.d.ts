import type { Request } from 'express';
import type { BinRequest, GetBinAPIResponse } from '../types/types.js';
export declare const saveRequestToBin: (binRoute: string, req: Request) => Promise<BinRequest>;
export declare const getRequestsInBin: (binRoute: string, req: Request) => Promise<GetBinAPIResponse>;
//# sourceMappingURL=requests.d.ts.map