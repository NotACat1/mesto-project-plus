import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      // user: { _id: string }
      user: jwt.JwtPayload
    }
    interface Error {
      statusCode?: number
    }
  }
}