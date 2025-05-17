const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const { testConnection, userQueries } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Маршрут для страницы игры
app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

// Маршруты для уровней
for (let i = 1; i <= 7; i++) {
    app.get(`/level${i}`, (req, res) => {
        res.sendFile(path.join(__dirname, `level${i}.html`));
    });
}

// Маршрут регистрации
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Проверяем, существует ли пользователь
        const existingUser = await userQueries.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Пользователь с таким email уже существует' });
        }

        // Хешируем пароль
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Создаем пользователя
        const newUser = await userQueries.registerUser(email, passwordHash, username);
        
        res.json({ success: true, message: 'Регистрация успешна' });
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера при регистрации' });
    }
});

// Маршрут авторизации
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Ищем пользователя
        const user = await userQueries.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ success: false, message: 'Пользователь не найден' });
        }

        // Проверяем пароль
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Неверный пароль' });
        }

        // Обновляем время последнего входа
        await userQueries.updateLastLogin(user.user_id);

        res.json({
            success: true,
            message: 'Успешная авторизация',
            token: 'dummy-token', // В реальном приложении здесь должен быть JWT токен
            name: user.username
        });
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера при авторизации' });
    }
});

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