import IController from '@application/interfaces/IController';

import requestAdapter from './requestAdapter';
import responseInvertAdapter from './responseAdapter';

import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

export default function routeAdapter(controller: IController) {
  return async (request: ExpressRequest, response: ExpressResponse) => {
    const controllerResponse = await controller.handle(requestAdapter(request));

    return responseInvertAdapter(response, controllerResponse);
  };
}
