import { Joi } from 'celebrate';
import { avatarValidator } from '@validations/validations';

// Валидация данных для регистрации пользователя
export const signupValidation = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: avatarValidator,
});

// Валидация данных для входа пользователя
export const signinValidation = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
