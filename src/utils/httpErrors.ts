import { constants as http2Constants } from 'http2';

import CustomError from '@utils/CustomError';

const {
  HTTP_STATUS_INTERNAL_SERVER_ERROR, // 400
  HTTP_STATUS_BAD_REQUEST, // 401
  HTTP_STATUS_UNAUTHORIZED, // 403
  HTTP_STATUS_NOT_FOUND, // 404
  HTTP_STATUS_FORBIDDEN, // 405
  HTTP_STATUS_METHOD_NOT_ALLOWED, // 500
} = http2Constants;

export const BadRequestError = (message: string) =>
  new CustomError(message, HTTP_STATUS_BAD_REQUEST);
export const UnauthorizedError = (message: string) =>
  new CustomError(message, HTTP_STATUS_UNAUTHORIZED);
export const ForbiddenError = (message: string) => new CustomError(message, HTTP_STATUS_FORBIDDEN);
export const NotFoundError = (message: string) => new CustomError(message, HTTP_STATUS_NOT_FOUND);
export const MethodNotAllowedError = (message: string) =>
  new CustomError(message, HTTP_STATUS_METHOD_NOT_ALLOWED);
export const InternalServerError = (message: string) =>
  new CustomError(message, HTTP_STATUS_INTERNAL_SERVER_ERROR);
