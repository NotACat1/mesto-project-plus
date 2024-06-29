import { Request, Response, NextFunction } from 'express';

import Card from '@models/card';
import CustomError from '@utils/CustomError';
import { createCardValidation } from '@validations/card';

// Контроллер для создания карточки
export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;

    // Валидация данных запроса
    const { error } = createCardValidation.validate({ name, link });
    if (error) {
      throw new CustomError('Не удалось выполнить проверку', 400);
    }

    const owner = req.user._id;

    const newCard = new Card({
      name,
      link,
      owner,
    });

    const savedCard = await newCard.save();

    res.status(201).json(savedCard);
  } catch (error) {
    next(error);
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
    const cardId = req.params.cardId;
    const card = await Card.findById(cardId);

    if (!card) {
      throw new CustomError('Карточка не найдена', 404);
    }

    if (card.owner.toString() !== req.user._id) {
      throw new CustomError('Вы не имеете права удалять эту карту', 403);
    }

    await card.remove();

    res.status(200).json({ message: 'Карточка удалена' });
  } catch (error) {
    next(error);
  }
};

// Контроллер для лайка карточки
export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cardId = req.params.cardId;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    ).populate('owner likes');

    if (!card) {
      throw new CustomError('Карточка не найдена', 404);
    }

    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};

// Контроллер для удаления лайка с карточки
export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cardId = req.params.cardId;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    ).populate('owner likes');

    if (!card) {
      throw new CustomError('Карточка не найдена', 404);
    }

    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};
