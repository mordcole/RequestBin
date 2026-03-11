import { ApiError } from '../errors.js';
import type { Request } from 'express';
import type { RequestData,
              BinRequest,
              GetBinAPIResponse,
              RequestWithBody } from '../types/types.js';

import db from '../services/db/index.js';

const formatDbTimestamp = (timestamp: Date): string => (
  timestamp.toISOString().replace('T', ' ').slice(0, 19)
);

const parseRequestToDB = (req: Request): RequestData => {
  return {
    method: req.method,
    parameters: req.params,
    headers: req.headers,
    body: req.rawBodyBuffer || req.body || {},
  }
}

const decodeBody = (body: any): object | string => {
  const buffer = extractBuffer(body);

  if (!buffer) {
    if (body === undefined || body === null || body === '') {
      return {};
    }
    return body;
  }

  const text = buffer.toString('utf8');

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const extractBuffer = (body: any): Buffer | undefined => {
  if (Buffer.isBuffer(body)) return body;

  if (body?._bsontype === 'Binary') {
    return body.buffer ?? body.value?.();
  }

  return undefined;
};

const toBinRequest = (req: RequestWithBody, binRoute: string): BinRequest => ({
  method: req.method,
  created_at: formatDbTimestamp(req.created_at),
  path: `/in/${binRoute}`,
  headers: req.headers as Record<string, string>,
  params: req.parameters as Record<string, string>,
  body: decodeBody(req.body),
});

export const saveRequestToBin = async (binRoute: string, req: Request): Promise<BinRequest> => {
  const bin = await db.bins.getByRoute(binRoute);

  if (!bin) {
    throw new ApiError(404, `Bin with route ${binRoute} not found.`);
  }

  const dbRequestRecord = await db.requests.create(bin.id, parseRequestToDB(req));
  const apiRequest = toBinRequest(dbRequestRecord, binRoute);
  return apiRequest;
};

export const getRequestsInBin = async (binRoute: string, req: Request): Promise<GetBinAPIResponse> => {
  const bin = await db.bins.getByRoute(binRoute);
  if (!bin) {
    throw new ApiError(404, `Bin with route ${binRoute} not found.`);
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    throw new ApiError(401, 'Unauthorized: No token provided');
  }

  const [scheme, token] = authHeader.split(' ');
  const isAuthorized = scheme === 'Bearer' && token === bin.token;
  if (!isAuthorized) {
    throw new ApiError(401, 'Unauthorized: Token invalid');
  }

  const dbRequestRecords = await db.requests.getByBinRoute(binRoute);
  const binRequests = dbRequestRecords.map(record => toBinRequest(record, binRoute));
  return { bin_route: binRoute, requests: binRequests };
}
