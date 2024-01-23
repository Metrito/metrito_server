import { IHeaders } from '@application/interfaces/IHeaders';
import IRequest from '@application/interfaces/IRequest';

import type { Request as ExpressRequest } from 'express';

export default function requestAdapter(request: ExpressRequest): IRequest {
  return {
    params: request.params,
    headers: request.headers as IHeaders,
    body: request.body,
    auth: undefined,
  };
}
