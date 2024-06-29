import mongoose, { Document, Schema } from 'mongoose';

import { isAvatarUrl, isEmail } from '@utils/validators';

// Интерфейс для пользователя
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

// Схема пользователя
const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: isEmail,
        message: 'Неверный формат email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 200,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      required: true,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: isAvatarUrl,
        message: 'Некорректная ссылка на аватар',
      },
    },
  },
  {
    versionKey: false, // Отключение версии документа
  },
);

// Модель пользователя
const User = mongoose.model<IUser>('user', userSchema);

export default User;
