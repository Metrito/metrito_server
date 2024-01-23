import { NextFunction } from 'express';

import ForbiddenError from '../errors/ForbiddenError';
import noAuthDev from '../functions/no-auth-dev';

/**
 * Ensure that the user of the request is an administrator.
 */
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (noAuthDev()) {
    console.info('NO_AUTH enabled, ignoring authentication');

    // @ts-expect-error
    req.userData = { _id: 'fake-user-id', email: 'fake-user-email' };

    return next();
  }

  // @ts-expect-error
  if (!req.user) {
    throw new Error(
      '"isAdmin" middleware must be placed after the "getUser" or "checkAuth" middleware.',
    );
  }

  // @ts-expect-error
  if (req.user.role < 100) {
    throw new ForbiddenError();
  }

  return next();
};

export default isAdmin;
