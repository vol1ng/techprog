const express = require('express');
const cors = require('cors');
const { testConnection } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Тестовый маршрут
app.get('/api/test', (req, res) => {
    res.json({ message: 'Сервер работает!' });
});

// Запуск сервера
app.listen(port, async () => {
    console.log(`Сервер запущен на порту ${port}`);
    // Проверка подключения к базе данных
    await testConnection();
}); 