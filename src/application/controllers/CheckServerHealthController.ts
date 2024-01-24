import IController from '@application/interfaces/IController';
import IResponse from '@application/interfaces/IResponse';

export default class CheckServerHealthController implements IController {
  async handle(): Promise<IResponse> {
    return {
      statusCode: 200,
      body: {
        ok: true,
      },
    };
  }
}
