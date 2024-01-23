// import { userMapper } from '../models/mappers/user.mapper';
// import usuarios from '../models/usuario.model';

import { NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

import APIError from '../errors/APIError';
import UnauthorizedError from '../errors/UnauthorizedError';
import noAuthDev from '../functions/no-auth-dev';

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (noAuthDev()) {
      console.info('NO_AUTH enabled, ignoring authentication');

      // @ts-expect-error
      req.userData = { _id: 'fake-user-id', email: 'fake-user-email' };

      return next();
    }

    // @ts-expect-error
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError();
    }

    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_KEY as string,
    ) as jwt.JwtPayload;

    if (!('email' in payload)) {
      throw new UnauthorizedError();
    }

    // const user = await usuarios.findOne({
    //   email: payload.email,
    // });

    // if (!user) {
    //   throw new UnauthorizedError();
    // }

    // req.user = userMapper.mongoToDomain(user.toObject());

    // if (user.is_banned) {
    //   throw new ForbiddenError();
    // }

    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedError('Sessão expirada');
    }

    if (error instanceof APIError) {
      throw error;
    }

    throw new UnauthorizedError();
  }
};

export default checkAuth;
