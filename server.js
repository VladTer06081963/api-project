const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
const routes = require('./routes1');
const PORT = process.env.PORT || 3000;

// Безопасность: Helmet для защиты заголовков с настройками для HTMX
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "unpkg.com"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));

// CORS: Настройка для локальных запросов
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));

// Rate limiting: Ограничение 100 запросов в 15 минут с одного IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // Максимум 100 запросов
    message: 'Слишком много запросов с этого IP, попробуйте позже.'
});
app.use(limiter);

// Логирование: Morgan для HTTP логов
app.use(morgan('combined'));

// Middleware для обработки JSON
app.use(express.json());

// Middleware для обработки URL-encoded данных
app.use(express.urlencoded({ extended: true }));

// Middleware для статических файлов с кэшированием
app.use(express.static(path.join(__dirname, 'public'), {
    // maxAge: '1y'
 // Кэширование на 1 год для статических файлов
}));

// API роуты
app.use('/api', routes);

// HTML-роут для главной страницы (для htmx)
app.get('/htmx/', (req, res) => {
    res.send(`
        <h4>Ответ от /:</h4>
        <pre>{
  "message": "Добро пожаловать в Express сервер!",
  "status": "Сервер работает корректно",
  "timestamp": "${new Date().toISOString()}",
  "version": "1.0.0"
}</pre>
        <p><strong>HTTP Status:</strong> 200</p>
    `);
});

// HTML-роут для статуса сервера (для htmx)
app.get('/htmx/status', (req, res) => {
    const uptime = process.uptime();
    const memory = process.memoryUsage();
    res.send(`
        <h4>Ответ от /status:</h4>
        <pre>{
  "status": "OK",
  "uptime": ${uptime},
  "memory": {
    "rss": ${memory.rss},
    "heapTotal": ${memory.heapTotal},
    "heapUsed": ${memory.heapUsed},
    "external": ${memory.external}
  },
  "timestamp": "${new Date().toISOString()}"
}</pre>
        <p><strong>HTTP Status:</strong> 200</p>
    `);
});

// HTML-роут для API hello (для htmx)
app.get('/htmx/api/hello', (req, res) => {
    res.send(`
        <h4>Ответ от /api/hello:</h4>
        <pre>{
  "message": "Привет от Express API!",
  "data": {
    "name": "Express Server",
    "version": "1.0.0"
  }
}</pre>
        <p><strong>HTTP Status:</strong> 200</p>
    `);
});

// HTML-роут для 404 ошибки (для htmx)
app.get('/htmx/nonexistent', (req, res) => {
    res.status(200).send(`
        <h4>Ошибка при запросе /nonexistent:</h4>
        <pre>{
  "error": "Роут не найден",
  "message": "Не могу найти /htmx/nonexistent",
  "availableRoutes": ["/api/", "/api/status", "/api/hello", "/api/info/port", "/api/info/status", "/api/info/uptime", "/htmx/", "/htmx/status", "/htmx/api/hello"]
}</pre>
        <p><strong>HTTP Status:</strong> 404</p>
    `);
});

// Обработка 404 ошибок
app.use((req, res) => {
    res.status(404).json({
        error: 'Роут не найден',
        message: `Не могу найти ${req.originalUrl}`,
        availableRoutes: ['/api/', '/api/status', '/api/hello', '/api/info/port', '/api/info/status', '/api/info/uptime', '/htmx/', '/htmx/status', '/htmx/api/hello']
    });
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err);
    res.status(500).json({
        error: 'Внутренняя ошибка сервера',
        message: err.message
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Express сервер запущен на порту http://localhost:${PORT}`);
    console.log(`📱 Доступные роуты:`);
    console.log(`   GET  / - Главная страница (статический index.html)`);
    console.log(`   GET  /api/ - Главная страница (JSON)`);
    console.log(`   GET  /api/status - Статус сервера (JSON)`);
    console.log(`   GET  /api/hello - Пример API (JSON)`);
    console.log(`   GET  /api/info/port - Текущий порт (JSON)`);
    console.log(`   GET  /api/info/status - Статус сервера (JSON)`);
    console.log(`   GET  /api/info/uptime - Время запуска (JSON)`);
    console.log(`   GET  /htmx/ - Главная страница (HTML)`);
    console.log(`   GET  /htmx/status - Статус сервера (HTML)`);
    console.log(`   GET  /htmx/api/hello - Пример API (HTML)`);
    console.log(`   GET  /htmx/nonexistent - Тест 404 (HTML)`);
});

// Обработка сигналов завершения
process.on('SIGTERM', () => {
    console.log('📴 Получен сигнал SIGTERM, завершаю работу...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('📴 Получен сигнал SIGINT, завершаю работу...');
    process.exit(0);
});

module.exports = app;
