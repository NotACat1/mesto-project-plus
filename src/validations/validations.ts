import Joi from 'joi';

import { isAvatarUrl } from '@utils/validators';

// Кастомный валидатор для проверки URL аватара
export const avatarValidator = Joi.string().custom((value, helpers) => {
  if (!isAvatarUrl(value)) {
    return helpers.error('any.invalid', { message: 'Некорректный URL аватара. Допустимые форматы: jpg, jpeg, png, gif' });
  }
  return value;
}, 'Avatar URL Validation');
