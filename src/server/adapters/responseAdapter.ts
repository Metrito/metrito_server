import IResponse from '@application/interfaces/IResponse';

import type { Response as ExpressResponse } from 'express';

export default function responseInvertAdapter(
  expressResponse: ExpressResponse,
  response: IResponse,
) {
  const { statusCode, body } = response;

  return expressResponse.status(statusCode).json(body);
}
