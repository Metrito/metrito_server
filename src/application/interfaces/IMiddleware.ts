import IRequest from './IRequest';
import IResponse from './IResponse';

type MiddlewareCancelResponse = {
  next: false;
} & IResponse;

type MiddlewareNextResponse = {
  next: true;
  metadata: Record<string, any>;
};

export type MiddlewareResponse =
  | MiddlewareCancelResponse
  | MiddlewareNextResponse;

export default interface IMiddleware {
  handle(request: IRequest): Promise<MiddlewareResponse>;
}
