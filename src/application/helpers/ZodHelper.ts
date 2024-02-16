import { AnyZodObject, ZodError, z } from 'zod';

import { InvalidParamError } from '@application/errors';
import IRequest from '@application/interfaces/IRequest';

import { badRequest } from './HttpHelper';

export async function zParse<T extends AnyZodObject>(
  schema: T,
  req: IRequest,
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(req);
  } catch (error: any | ZodError) {
    if (error instanceof ZodError) {
      throw new InvalidParamError(error.message);
    }

    return badRequest(error);
  }
}
