import express from 'express';

import UserRouter from '@routes/user';
import cardRouter from '@routes/card';
import CustomError from '@utils/CustomError';
import auth from '@middlewares/auth';
import { login, createUser } from '@controllers/user';

const routes = express.Router();

routes.post('/signin', login);
routes.post('/signup', createUser);

routes.use('/users', auth, UserRouter);
routes.use('/cards', auth, cardRouter);

routes.all('*', (req, res, next) => {
  next(new CustomError('Неверный адрес запроса', 404));
});

export default routes;
