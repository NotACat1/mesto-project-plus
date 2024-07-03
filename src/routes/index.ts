import express from 'express';
import { celebrate, Segments } from 'celebrate';

import UserRouter from '@routes/user';
import cardRouter from '@routes/card';
import { NotFoundError } from '@utils/httpErrors';
import auth from '@middlewares/auth';
import { login, createUser } from '@controllers/user';
import { signinValidation, signupValidation } from '@validations/sign';

const routes = express.Router();

routes.post(
  '/signin',
  celebrate({
    [Segments.BODY]: signinValidation,
  }),
  login,
);
routes.post(
  '/signup',
  celebrate({
    [Segments.BODY]: signupValidation,
  }),
  createUser,
);

routes.use(auth);
routes.use('/users', UserRouter);
routes.use('/cards', cardRouter);

routes.all('*', (req, res, next) => {
  next(NotFoundError('Неверный адрес запроса'));
});

export default routes;
