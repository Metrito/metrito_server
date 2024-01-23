import { Request } from 'express';

export default interface CustomRequest extends Request {
  user?: { role: number };
  userData?: { _id: string; email: string };
}
