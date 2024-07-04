import { constants as http2Constants } from 'http2';

import CustomError from '@utils/CustomError';

const {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_METHOD_NOT_ALLOWED,
  HTTP_STATUS_CONFLICT,
} = http2Constants;

export const BadRequestError = (message: string) =>
  new CustomError(message, HTTP_STATUS_BAD_REQUEST);
export const UnauthorizedError = (message: string) =>
  new CustomError(message, HTTP_STATUS_UNAUTHORIZED);
export const ForbiddenError = (message: string) => new CustomError(message, HTTP_STATUS_FORBIDDEN);
export const NotFoundError = (message: string) => new CustomError(message, HTTP_STATUS_NOT_FOUND);
export const MethodNotAllowedError = (message: string) =>
  new CustomError(message, HTTP_STATUS_METHOD_NOT_ALLOWED);
export const ConflictError = (message: string) =>
  new CustomError(message, HTTP_STATUS_CONFLICT);
export const InternalServerError = (message: string) =>
  new CustomError(message, HTTP_STATUS_INTERNAL_SERVER_ERROR);
