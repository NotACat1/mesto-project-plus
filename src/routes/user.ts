import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import {
  createUser,
  getUserById,
  getAllUsers,
  updateAvatar,
  updateProfile,
} from '@controllers/user';
import {
  createUserValidation,
  updateAvatarValidation,
  updateProfileValidation,
} from '@validations/user';

const router = express.Router();

router.get('/', getAllUsers);

router.get(
  '/:userId',
  celebrate({
    [Segments.PARAMS]: {
      userId: Joi.string().required(),
    },
  }),
  getUserById,
);

router.post(
  '/',
  celebrate({
    [Segments.BODY]: createUserValidation,
  }),
  createUser,
);

router.patch(
  '/me',
  celebrate({
    [Segments.BODY]: updateProfileValidation,
  }),
  updateProfile,
);

router.patch(
  '/me/avatar',
  celebrate({
    [Segments.BODY]: updateAvatarValidation,
  }),
  updateAvatar,
);

export default router;
