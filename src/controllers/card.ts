import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { constants as http2Constants } from 'http2';

import Card from '@models/card';
import { UnauthorizedError, NotFoundError, BadRequestError, ForbiddenError } from '@utils/httpErrors';

const { HTTP_STATUS_CREATED, HTTP_STATUS_OK } = http2Constants;

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

    res.status(HTTP_STATUS_CREATED).json(savedCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(BadRequestError('Ошибка валидации'));
    } else {
      next(error); // Передаём ошибку обработчику ошибок
    }
  }
};

// Контроллер для получения всех карточек
export const getAllCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find().populate('owner likes');
    res.status(HTTP_STATUS_OK).json(cards);
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
      throw ForbiddenError('Вы не имеете права удалять эту карту');
    }

    await card.remove();

    res.status(HTTP_STATUS_OK).json({ message: 'Карточка удалена' });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
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
    )
      .populate('owner likes')
      .orFail(NotFoundError('Карточка не найдена'));

    res.status(HTTP_STATUS_OK).json(card);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
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
    )
      .populate('owner likes')
      .orFail(NotFoundError('Карточка не найдена'));

    res.status(HTTP_STATUS_OK).json(card);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(BadRequestError('Невалидный ID'));
    } else {
      next(error); // Передаём ошибку обработчику ошибок
    }
  }
};
