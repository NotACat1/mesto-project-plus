import { Request, Response } from 'express';
import { constants as http2Constants } from 'http2';

import CustomError from '@utils/CustomError';

const { HTTP_STATUS_METHOD_NOT_ALLOWED } = http2Constants;

// Middleware для обработки ошибок
const errorHandler = (err: CustomError, req: Request, res: Response) => {
  const { statusCode = HTTP_STATUS_METHOD_NOT_ALLOWED, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === HTTP_STATUS_METHOD_NOT_ALLOWED ? 'На сервере произошла ошибка' : message,
  });
};

export default errorHandler;
