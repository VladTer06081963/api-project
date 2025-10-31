const express = require('express');
const router = express.Router();

// Базовый роут для главной страницы
router.get('/', (req, res) => {
    res.json({
        message: 'Добро пожаловать в Express сервер!',
        status: 'Сервер работает корректно',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Роут для проверки статуса сервера
router.get('/status', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});

// Роут для API
router.get('/hello', (req, res) => {
    res.json({
        message: 'Привет от Express API!',
        data: {
            name: 'Express Server',
            version: '1.0.0'
        }
    });
});

// API для получения динамических данных

// Роут для получения текущего порта
router.get('/info/port', (req, res) => {
    res.json({
        port: process.env.PORT || 3000
    });
});

// Роут для получения статуса сервера
router.get('/info/status', (req, res) => {
    res.json({
        status: 'Активен',
        uptime: process.uptime()
    });
});

// Роут для получения времени запуска
router.get('/info/uptime', (req, res) => {
    const uptime = process.uptime();
    const startTime = new Date(Date.now() - (uptime * 1000));
    res.json({
        uptime: uptime,
        startTime: startTime.toLocaleString('ru-RU')
    });
});

module.exports = router;