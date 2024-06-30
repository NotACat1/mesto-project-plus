import { Request, Response } from 'express';

import CustomError from '@utils/CustomError';

// Middleware для обработки ошибок
const errorHandler = (err: CustomError, req: Request, res: Response) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
};

export default errorHandler;
