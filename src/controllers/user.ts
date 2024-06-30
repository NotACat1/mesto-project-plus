import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import User from '@models/user';
import { BadRequestError, NotFoundError } from '@utils/httpErrors';

// Функция-декоратор для обновления профиля пользователя
export const updateUserProfile =
  (updateFn: (userId: mongoose.Types.ObjectId, data: any) => Promise<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, about } = req.body;
    const userId = req.user._id;

    try {
      const updatedUser = await updateFn(userId, { name, about });
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        next(BadRequestError('Ошибка валидации'));
      } else if (error instanceof mongoose.Error.CastError) {
        next(NotFoundError('Пользователь не найден'));
      } else {
        next(error); // Передаём ошибку обработчику ошибок
      }
    }
  };

// Декоратор для обновления аватара пользователя
export const updateAvatar = async (userId: mongoose.Types.ObjectId, avatar: string) => {
  return await User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true });
};

// Декоратор для обновления профиля пользователя
export const updateProfile = async (
  userId: mongoose.Types.ObjectId,
  data: { name: string; about: string },
) => {
  return await User.findByIdAndUpdate(
    userId,
    { name: data.name, about: data.about },
    { new: true, runValidators: true },
  );
};

// Контроллер для создания пользователя
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;

    // Создание пользователя
    const newUser = new User({
      name,
      about,
      avatar,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(BadRequestError('Ошибка валидации'));
    } else {
      next(error); // Передаём ошибку обработчику ошибок
    }
  }
};

// Контроллер для получения всех пользователей
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Контроллер для получения пользователя по ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(NotFoundError('Пользователь не найден'));
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const { NODE_ENV, JWT_SECRET } = process.env;

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    // Найти пользователя по email
    const user = await User.findOne({ email }).orFail(NotFoundError('Пользователь не найден'));

    // Если пользователь не найден или пароль неверный, вернуть ошибку 401
    if (!(await bcrypt.compare(password, user.password))) {
      throw BadRequestError('Неправильные почта или пароль');
    }

    // Создать JWT с сроком на неделю
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? (JWT_SECRET as string) : 'secret',
      {
        expiresIn: '7d',
      },
    );

    // Отправить JWT в httpOnly куке
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 1 неделя

    // Также можно отправить токен в теле ответа
    res.json({ token });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(BadRequestError('Ошибка валидации'));
    } else {
      next(error); // Передаём ошибку обработчику ошибок
    }
  }
};
