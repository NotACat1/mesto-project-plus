import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import CustomError from '@utils/CustomError';

const { NODE_ENV, JWT_SECRET } = process.env;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new CustomError('Для выполнения действия необходима авторизация', 401);
  }

  // Получаем токен из заголовка Authorization
  const token = authorization.replace('Bearer ', '');

  if (!token) {
    throw new CustomError('Необходим токен авторизации', 401);
  }

  try {
    const payload = jwt.verify(token, NODE_ENV === 'production' ? (JWT_SECRET as string) : 'secret') as JwtPayload;
    req.user = payload;
    next();
  } catch (error) {
    next(new CustomError('Неверный токен авторизации', 401));
  }
};

export default authMiddleware;
