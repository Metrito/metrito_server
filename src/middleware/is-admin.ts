import { NextFunction, Response } from 'express';

import ForbiddenError from 'errors/ForbiddenError';
import noAuthDev from 'functions/no-auth-dev';

import CustomRequest from '../@types/express/CustomRequest';

/**
 * Ensure that the user of the request is an administrator.
 */
const isAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  if (noAuthDev()) {
    console.info('NO_AUTH enabled, ignoring authentication');

    req.userData = { _id: 'fake-user-id', email: 'fake-user-email' };

    return next();
  }

  if (!req.user) {
    throw new Error(
      '"isAdmin" middleware must be placed after the "getUser" or "checkAuth" middleware.',
    );
  }

  if (req.user.role < 100) {
    throw new ForbiddenError();
  }

  return next();
};

export default isAdmin;
