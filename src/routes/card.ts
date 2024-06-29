import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { createCard, deleteCardById, dislikeCard, getAllCards, likeCard } from '@controllers/card';
import { createCardValidation } from '@validations/card';

const router = Router();

router.get('/', getAllCards);

router.post(
  '/',
  celebrate({
    [Segments.BODY]: createCardValidation,
  }),
  createCard,
);

router.delete(
  '/:cardId',
  celebrate({
    [Segments.PARAMS]: {
      cardId: Joi.string().required(),
    },
  }),
  deleteCardById,
);

router.put(
  '/:cardId/likes',
  celebrate({
    [Segments.PARAMS]: {
      cardId: Joi.string().required(),
    },
  }),
  likeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    [Segments.PARAMS]: {
      cardId: Joi.string().required(),
    },
  }),
  dislikeCard,
);

export default router;
