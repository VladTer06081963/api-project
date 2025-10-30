# Express Server Project

Простой HTTP сервер на Express.js с базовыми API роутами и поддержкой статических файлов.

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Запуск сервера
```bash
npm start
```

Сервер запустится на порту 3000.

## 📋 Доступные скрипты

- `npm start` - Запуск Express сервера
- `npm run server` - Альтернативный способ запуска сервера
- `npm run dev` - Запуск оригинального Node.js скрипта

## 🌐 API Endpoints

### JSON Endpoints (под /api)
- **GET /api/** - Главная страница (JSON)
- **GET /api/status** - Статус сервера (JSON)
- **GET /api/hello** - Пример API (JSON)

### Info Endpoints (динамические данные под /api)
- **GET /api/info/port** - Текущий порт сервера
- **GET /api/info/status** - Статус сервера
- **GET /api/info/uptime** - Время запуска сервера

### HTML Endpoints (для htmx)
- **GET /htmx/** - Главная страница (HTML для htmx)
- **GET /htmx/status** - Статус сервера (HTML для htmx)
- **GET /htmx/api/hello** - Пример API (HTML для htmx)
- **GET /htmx/nonexistent** - Тест 404 (HTML для htmx)

### Статические файлы
- **GET /** - Главная страница (index.html)

**Пример JSON ответа (GET /api/):**
```json
{
  "message": "Добро пожаловать в Express сервер!",
  "status": "Сервер работает корректно",
  "timestamp": "2025-10-25T20:58:31.699Z",
  "version": "1.0.0"
}
```

**Пример HTML ответа (GET /htmx/):**
```html
<h4>Ответ от /:</h4>
<pre>{
  "message": "Добро пожаловать в Express сервер!",
  "status": "Сервер работает корректно",
  "timestamp": "2025-10-25T20:58:31.699Z",
  "version": "1.0.0"
}</pre>
<p><strong>HTTP Status:</strong> 200</p>
```

## 📁 Статические файлы

Сервер поддерживает статические файлы из папки `public/` с кэшированием на 1 год для улучшения производительности. Доступные страницы:
- `http://localhost:3000/index.html` — Главная страница с тестированием API через HTMX
- `http://localhost:3000/curl-demo.html` — Демонстрация curl команд и их использование
- `http://localhost:3000/curl-jq-demo.html` — Примеры обработки JSON с помощью curl + jq

## ⚡ htmx Интеграция

Проект использует htmx для динамического обновления HTML без JavaScript. htmx позволяет отправлять AJAX-запросы прямо из HTML-атрибутов:

- `hx-get` - URL для GET-запроса
- `hx-target` - элемент для обновления
- `hx-swap` - способ вставки (например, innerHTML)

Это упрощает взаимодействие с API и улучшает пользовательский опыт.

## 🛠 Структура проекта

```
cline-test/
├── server.js          # Express сервер и htmx роуты
├── routes1.js         # JSON API роуты
├── index.js           # Оригинальный Node.js скрипт
├── package.json       # Конфигурация проекта
├── public/            # Статические файлы
│   ├── index.html     # Тестовая HTML страница
│   ├── script.js      # JavaScript (пустой)
│   └── style.css      # Стили
├── .github/           # GitHub конфигурация
│   └── chatmodes/     # Chat modes
│       └── ollama.chatmode.md
├── .DS_Store          # Системный файл macOS
└── README.md          # Документация
```

## 🔧 Конфигурация

Сервер можно настроить через переменные окружения:

- `PORT` - порт сервера (по умолчанию: 3000)

Статические файлы кэшируются на 1 год (Cache-Control: public, max-age=31536000) для оптимизации загрузки.

Пример:
```bash
PORT=8080 npm start
```

## 📊 Обработка ошибок

- **404 Not Found** - для несуществующих роутов
- **500 Internal Server Error** - для серверных ошибок

## 🧪 Тестирование

1. Запустите сервер: `npm start`
2. Откройте браузер и перейдите на `http://localhost:3000` (главная страница с HTMX)
3. Перейдите на `http://localhost:3000/curl-demo.html` для демонстрации curl команд
4. Используйте HTML интерфейс для тестирования API через HTMX (кнопки отправляют AJAX-запросы и обновляют страницу динамически)
5. Или используйте curl для прямого тестирования:

```bash
# Тест главной страницы (HTML)
curl http://localhost:3000/

# Тест JSON API
curl http://localhost:3000/api/hello

# Тест статуса
curl http://localhost:3000/api/status

# Тест HTML для htmx
curl http://localhost:3000/htmx/api/hello

# Тест 404
curl http://localhost:3000/nonexistent
```

## 🔍 Работа с curl + jq

### Установка jq

jq — это легковесный инструмент командной строки для обработки JSON данных. Для его установки используйте:

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Windows (через Chocolatey)
choco install jq
```

### Базовые примеры

1. Форматированный вывод JSON:
```bash
curl -s http://localhost:3000/api/ | jq '.'
```

2. Извлечение конкретного поля:
```bash
curl -s http://localhost:3000/api/ | jq '.message'
```

3. Создание нового объекта:
```bash
curl -s http://localhost:3000/api/hello | jq '{ msg: .message, ver: .data.version }'
```

### Продвинутые примеры

1. Объединение данных из разных запросов:
```bash
# Получаем порт и добавляем его к информации о статусе
PORT=$(curl -s http://localhost:3000/api/info/port | jq -r '.port')
curl -s http://localhost:3000/api/status | jq --arg port "$PORT" '. + {port: $port}'
```

2. Форматирование даты:
```bash
# Извлекаем дату из timestamp
curl -s http://localhost:3000/api/ | jq -r '.timestamp | split("T") | .[0]'
```

3. Вывод в CSV формат:
```bash
# Конвертируем статус и uptime в CSV
curl -s http://localhost:3000/api/status | jq -r '[.status, .uptime] | @csv'
```

### Полезные фильтры jq

- `.` - вывести весь JSON с форматированием
- `.field` - получить значение поля
- `{ new: .old }` - создать новый объект
- `select(условие)` - фильтровать по условию
- `map(выражение)` - преобразовать массив
- `keys` - получить ключи объекта
- `-r` или `--raw-output` - вывод без кавычек
- `--arg name value` - передача переменной в jq

Подробная документация по jq доступна на [официальном сайте](https://stedolan.github.io/jq/).

## 📝 Лицензия

ISC
