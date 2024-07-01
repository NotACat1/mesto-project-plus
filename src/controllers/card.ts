import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import Card from '@models/card';
import { UnauthorizedError, NotFoundError, BadRequestError } from '@utils/httpErrors';

// Контроллер для создания карточки
export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;

    const owner = req.user._id;

    const newCard = new Card({
      name,
      link,
      owner,
    });

    const savedCard = await newCard.save();

    res.status(201).json(savedCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(BadRequestError('Ошибка валидации'));
    } else if (error instanceof mongoose.Error.CastError) {
      next(BadRequestError('Невалидный ID'));
    } else {
      next(error); // Передаём ошибку обработчику ошибок
    }
  }
};

// Контроллер для получения всех карточек
export const getAllCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find().populate('owner likes');
    res.status(200).json(cards);
  } catch (error) {
    next(error);
  }
};

// Контроллер для удаления карточки по ID
export const deleteCardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).orFail(NotFoundError('Карточка не найдена'));

    if (card.owner.toString() !== req.user._id) {
      throw UnauthorizedError('Вы не имеете права удалять эту карту');
    }

    await card.remove();

    res.status(200).json({ message: 'Карточка удалена' });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(BadRequestError('Ошибка валидации'));
    } else if (error instanceof mongoose.Error.CastError) {
      next(BadRequestError('Невалидный ID'));
    } else {
      next(error); // Передаём ошибку обработчику ошибок
    }
  }
};

// Контроллер для лайка карточки
export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    ).populate('owner likes').orFail(NotFoundError('Карточка не найдена'));

    res.status(200).json(card);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(BadRequestError('Ошибка валидации'));
    } else if (error instanceof mongoose.Error.CastError) {
      next(BadRequestError('Невалидный ID'));
    } else {
      next(error); // Передаём ошибку обработчику ошибок
    }
  }
};

// Контроллер для удаления лайка с карточки
export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    ).populate('owner likes').orFail(NotFoundError('Карточка не найдена'));

    res.status(200).json(card);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(BadRequestError('Ошибка валидации'));
    } else if (error instanceof mongoose.Error.CastError) {
      next(BadRequestError('Невалидный ID'));
    } else {
      next(error); // Передаём ошибку обработчику ошибок
    }
  }
};
