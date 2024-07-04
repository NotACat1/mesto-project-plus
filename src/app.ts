import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { errors } from 'celebrate';

import errorHandler from '@middlewares/errorHandler';
import { errorLogger, requestLogger } from '@middlewares/logger';
import routes from '@routes/index';

// Получение переменных окруженияn
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

// Создание экземпляра приложения Express
const app = express();

// Middleware для безопасности заголовков
app.use(helmet());

// Подключаем middleware для парсинга JSON
app.use(express.json());

// Middleware для логирования запросов
app.use(requestLogger);

// Подключение к базе данных MongoDB
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log(`Connected to database on ${DB_URL}`);
  })
  .catch((err) => {
    console.log(`Error on database connection ${DB_URL}`);
    console.error(err);
    process.exit(1); // Завершение процесса при ошибке подключения
  });

app.use(routes);

// Middleware для логирования ошибок
app.use(errorLogger);

// Обработчик ошибок celebrate для обработки ошибок валидации
app.use(errors());

// Middleware для обработки ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
