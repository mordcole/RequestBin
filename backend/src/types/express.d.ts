import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    rawBodyText?: string;
    rawBodyBuffer?: Buffer;
  }
}
