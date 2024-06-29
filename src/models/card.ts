import mongoose, { Document, Schema } from 'mongoose';

import { isAvatarUrl } from '@utils/validators';

// Интерфейс для карточки
export interface ICard extends Document {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}

// Схема карточки
const cardSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: isAvatarUrl,
        message: 'Некорректная ссылка на изображение',
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'user',
        },
      ],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false, // Отключение версии документа
  },
);

// Модель карточки
const Card = mongoose.model<ICard>('card', cardSchema);

export default Card;
