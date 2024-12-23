import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../app/utils/catchAsync';
import AppError from '../../app/errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../app/config';
import { TUserRole } from '../user/user.interface';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not Authorized User!',
      );
    }
    // check to valid token
    jwt.verify(
      token,
      config.jwt_access_token as string,
      function (err, decoded) {
        if (err) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            'You are not Authorized User!',
          );
        }
        const role = (decoded as JwtPayload).role;
        if (requiredRoles && !requiredRoles.includes(role)) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            'You are not authorized user!',
          );
        }
        req.user = decoded as JwtPayload;
        next();
      },
    );
  });
};
export default auth;
