import validator from 'validator';

// Функция для проверки валидности URL
export const isURL = (value: string): boolean => {
  return validator.isURL(value);
};

// Функция для валидации ссылки на аватарку
export const isAvatarUrl = (value: string): boolean => {
  return validator.isURL(value) && /\.(jpg|jpeg|png|gif)$/i.test(value);
};

// Функция для валидации email
export const isEmail = (value: string): boolean => {
  return validator.isEmail(value);
};