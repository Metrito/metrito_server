import { IHeaders } from './IHeaders';

export default interface IRequest<TAuthenticated extends boolean = false> {
  params: Record<string, string>;
  headers: IHeaders;
  body: Record<string, any>;
  auth: TAuthenticated extends true ? {} : undefined;
}
