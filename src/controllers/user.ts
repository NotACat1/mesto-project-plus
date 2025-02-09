import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { constants as http2Constants } from 'http2';

import User from '@models/user';
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} from '@utils/httpErrors';

const saltRounds = 10; // Количество раундов для генерации соли bcrypt

const { HTTP_STATUS_CREATED, HTTP_STATUS_OK } = http2Constants;

// Контроллер для создания пользователя
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Создание пользователя
    const newUser = new User({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(HTTP_STATUS_CREATED).send(newUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(BadRequestError('Ошибка валидации'));
    }
    if ((error as any).code === 11000) {
      // MongoDB duplicate key error code
      next(ConflictError('Пользователь с таким email уже существует'));
    } else {
      next(error); // Передаём ошибку обработчику ошибок
    }
  }
};

// Контроллер для получения всех пользователей
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.status(HTTP_STATUS_OK).json(users);
  } catch (error) {
    next(error);
  }
};

// Контроллер для получения пользователя по ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(NotFoundError('Пользователь не найден'));
    res.status(HTTP_STATUS_OK).json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(BadRequestError('Невалидный ID'));
    } else {
      next(error); // Передаём ошибку обработчику ошибок
    }
  }
};

// Контроллер для обновления профиля пользователя
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(NotFoundError('Пользователь не найден'));
    res.status(HTTP_STATUS_OK).json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(BadRequestError('Ошибка валидации'));
    } else {
      next(error); // Передаём ошибку обработчику ошибок
    }
  }
};

// Контроллер для обновления аватара пользователя
export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    ).orFail(NotFoundError('Пользователь не найден'));
    res.status(HTTP_STATUS_OK).json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(BadRequestError('Ошибка валидации'));
    } else {
      next(error); // Передаём ошибку обработчику ошибок
    }
  }
};

const { NODE_ENV, JWT_SECRET } = process.env;

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    // Найти пользователя по email
    const user = await User.findOne({ email })
      .orFail(UnauthorizedError('Пользователь не авторизован'))
      .select('+password');

    // Если пользователь не найден или пароль неверный, вернуть ошибку 401
    if (!(await bcrypt.compare(password, user.password))) {
      throw UnauthorizedError('Пользователь не авторизован');
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
    } else if (error instanceof mongoose.Error.CastError) {
      next(BadRequestError('Невалидный ID'));
    } else {
      next(error); // Передаём ошибку обработчику ошибок
    }
  }
};

export const getUserMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).orFail(NotFoundError('Пользователь не найден'));
    res.status(HTTP_STATUS_OK).json(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(BadRequestError('Невалидный ID'));
    } else {
      next(error);
    }
  }
};
