import { Request, Response, NextFunction } from 'express';
import { constants as http2Constants } from 'http2';

import CustomError from '@utils/CustomError';

const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = http2Constants;

// Middleware для обработки ошибок
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : message,
  });

  next(err);
};

export default errorHandler;
