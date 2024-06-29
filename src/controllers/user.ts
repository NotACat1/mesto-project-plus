import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '@models/user';
import CustomError from '@utils/CustomError';
import {
  createUserValidation,
  updateAvatarValidation,
  updateProfileValidation,
  loginValidation,
} from '@validations/user';

// Контроллер для создания пользователя
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;

    // Валидация данных запроса
    const { error } = createUserValidation.validate({ name, about, avatar });
    if (error) {
      throw new CustomError('Не удалось выполнить проверку', 400);
    }

    // Создание пользователя
    const newUser = new User({
      name,
      about,
      avatar,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
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
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError('Пользователь не найден', 404);
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Контроллер для обновления профиля пользователя
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;

    // Валидация данных запроса
    const { error } = updateProfileValidation.validate({ name, about });
    if (error) {
      throw new CustomError('Validation failed', 400);
    }

    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Контроллер для обновления аватара пользователя
export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;

    // Валидация данных запроса
    const { error } = updateAvatarValidation.validate({ avatar });
    if (error) {
      throw new CustomError('Validation failed', 400);
    }

    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const { NODE_ENV, JWT_SECRET } = process.env;

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { error } = loginValidation.validate({ email, password });
  if (error) {
    return res.status(400).json({ message: 'Некорректные данные' });
  }

  try {
    // Найти пользователя по email
    const user = await User.findOne({ email });

    // Если пользователь не найден или пароль неверный, вернуть ошибку 401
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new CustomError('Неправильные почта или пароль', 401);
    }

    // Создать JWT с сроком на неделю
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? (JWT_SECRET as string) : 'secret', {
      expiresIn: '7d',
    });

    // Отправить JWT в httpOnly куке
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 1 неделя

    // Также можно отправить токен в теле ответа
    res.json({ token });
  } catch (error) {
    console.error('Ошибка при аутентификации', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};
