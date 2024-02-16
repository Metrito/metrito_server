import IResponse from '@application/interfaces/IResponse';

import { ServerError, UnauthorizedError } from '../errors';

export const badRequest = (error: Error): IResponse => ({
  statusCode: 400,
  body: error,
});

export const forbidden = (error: Error): IResponse => ({
  statusCode: 403,
  body: error,
});

export const unauthorized = (): IResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
});

export const serverError = (error: Error): IResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack),
});

export const ok = (data: any): IResponse => ({
  statusCode: 200,
  body: data,
});

export const noContent = (): IResponse => ({
  statusCode: 204,
  body: null,
});
