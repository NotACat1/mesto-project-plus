import Joi from 'joi';

// Валидация данных для создания профиля
export const createUserValidation = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  about: Joi.string().min(2).max(200).required(),
  avatar: Joi.string().required(),
});

// Валидация данных для обновления профиля
export const updateProfileValidation = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  about: Joi.string().min(2).max(200).required(),
});

// Валидация данных для обновления аватара
export const updateAvatarValidation = Joi.object({
  avatar: Joi.string().required(),
});

// Схема валидации для логина
export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
