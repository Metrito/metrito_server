import IRequest from './IRequest';
import IResponse from './IResponse';

export default interface IController {
  handle(request: IRequest): Promise<IResponse>;
}
