import IMiddleware from '@application/interfaces/IMiddleware';

import requestAdapter from './requestAdapter';
import responseInvertAdapter from './responseAdapter';

import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from 'express';

export default function middlewareAdapter(middleware: IMiddleware) {
  return async (
    request: ExpressRequest,
    response: ExpressResponse,
    next: NextFunction,
  ) => {
    const middlewareResponse = await middleware.handle(requestAdapter(request));

    if (middlewareResponse.next) {
      const { metadata } = middlewareResponse;

      request.metadata = metadata;

      return next();
    }

    return responseInvertAdapter(response, middlewareResponse);
  };
}
