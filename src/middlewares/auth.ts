import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { BadRequestError, UnauthorizedError } from '@utils/httpErrors';

const { NODE_ENV, JWT_SECRET } = process.env;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw UnauthorizedError('Для выполнения действия необходима авторизация');
  }

  // Получаем токен из заголовка Authorization
  const token = authorization.replace('Bearer ', '');

  if (!token) {
    throw BadRequestError('Необходим токен авторизации');
  }

  try {
    const payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? (JWT_SECRET as string) : 'secret',
    ) as JwtPayload;
    req.user = payload;
    next();
  } catch (error) {
    next(UnauthorizedError('Неверный токен авторизации'));
  }
};

export default authMiddleware;
