import Joi from 'joi';

import { avatarValidator } from '@validations/validations';

// Валидация данных для создания карточки
export const createCardValidation = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  link: avatarValidator,
});
