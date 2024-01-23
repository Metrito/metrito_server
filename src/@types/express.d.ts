declare namespace Express {
  interface Request {
    metadata?: {
      [key: string]: any;
    };
  }
}
