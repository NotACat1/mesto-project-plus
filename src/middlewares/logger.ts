import expressWinston from 'express-winston';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info', // Уровень логирования
  format: winston.format.json(), // Формат JSON для записи логов
  transports: [
    // Транспорт для вывода в консоль
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Раскрашивание уровней логов
        winston.format.simple(), // Простой формат вывода
      ),
    }),
    // Транспорт для записи в файл request.log
    new winston.transports.File({ filename: 'request.log', level: 'info' }),
    // Транспорт для записи в файл error.log
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

// Middleware для логирования запросов
export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  meta: true, // Включаем метаданные запроса (например, IP и URL)
  msg: 'HTTP {{req.method}} {{req.url}}', // Шаблон сообщения лога
  expressFormat: true, // Используем стандартный формат express
});

// Middleware для логирования ошибок
export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
});

export default logger;
