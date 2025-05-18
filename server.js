const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const { testConnection, userQueries, markedWordsQueries } = require('./db');
const { Resend } = require('resend');

const app = express();
const port = process.env.PORT || 3000;
const resend = new Resend('re_4wyPLDjE_EYcvu4pkZsTSWW8KPi5nZBft');

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
        
        console.log('=== Начало регистрации ===');
        console.log('Получены данные:', { username, email });
        
        // Проверяем, существует ли пользователь
        const existingUser = await userQueries.findUserByEmail(email);
        if (existingUser) {
            console.log('Пользователь уже существует:', email);
            return res.status(400).json({ success: false, message: 'Пользователь с таким email уже существует' });
        }

        // Хешируем пароль
        const passwordHash = await bcrypt.hash(password, 10);
        console.log('Пароль захеширован');
        
        // Создаем пользователя
        const newUser = await userQueries.registerUser(email, passwordHash, username);
        console.log('Пользователь создан:', newUser);
        
        // Сразу создаем сессию для нового пользователя
        const token = 'dummy-token-' + Date.now(); // В реальном приложении здесь должен быть JWT токен
        
        res.json({ 
            success: true, 
            message: 'Регистрация успешна',
            token: token,
            user: {
                id: newUser.user_id,
                username: newUser.username,
                email: newUser.email
            }
        });
        console.log('=== Регистрация завершена успешно ===');
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера при регистрации',
            error: error.message 
        });
    }
});

// Маршрут авторизации
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('=== Начало входа ===');
        console.log('Попытка входа для email:', email);
        
        // Ищем пользователя
        const user = await userQueries.findUserByEmail(email);
        if (!user) {
            console.log('Пользователь не найден:', email);
            return res.status(400).json({ success: false, message: 'Пользователь не найден' });
        }

        // Проверяем пароль
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            console.log('Неверный пароль для пользователя:', email);
            return res.status(400).json({ success: false, message: 'Неверный пароль' });
        }

        // Обновляем время последнего входа
        await userQueries.updateLastLogin(user.user_id);
        console.log('Время входа обновлено');

        const token = 'dummy-token-' + Date.now(); // В реальном приложении здесь должен быть JWT токен
        
        res.json({
            success: true,
            message: 'Успешная авторизация',
            token: token,
            name: user.username,
            userId: user.user_id
        });
        console.log('=== Вход выполнен успешно ===');
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера при авторизации',
            error: error.message 
        });
    }
});

// Endpoint для отправки кода подтверждения
app.post('/api/send-verification', async (req, res) => {
  const { email, code } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'Dictionary App <onboarding@resend.dev>',
      to: [email],
      subject: 'Код подтверждения регистрации',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Подтверждение регистрации</h2>
          <p>Ваш код подтверждения: <strong>${code}</strong></p>
          <p>Введите этот код в форму регистрации для подтверждения вашего email.</p>
        </div>
      `
    });

    console.log('Email sent successfully:', data);
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при отправке email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка при отправке кода подтверждения',
      error: error.message 
    });
  }
});

// Эндпоинт для сохранения отмеченного слова
app.post('/api/marked-words', async (req, res) => {
    try {
        console.log('=== Начало сохранения отмеченного слова ===');
        const { userId, word } = req.body;
        console.log('Получены данные:', { userId, word });

        if (!userId || !word) {
            console.log('Отсутствуют обязательные параметры');
            return res.status(400).json({
                success: false,
                message: 'Отсутствуют обязательные параметры'
            });
        }

        // Проверяем, существует ли уже такое слово для пользователя
        console.log('Проверка существующего слова...');
        const existingWord = await markedWordsQueries.findMarkedWord(userId, word);
        console.log('Результат проверки:', existingWord);

        if (existingWord) {
            console.log('Слово уже отмечено');
            return res.json({ 
                success: true, 
                message: 'Слово уже отмечено',
                isMarked: true 
            });
        }

        // Сохраняем слово
        console.log('Сохранение слова...');
        const savedWord = await markedWordsQueries.addMarkedWord(userId, word);
        console.log('Слово сохранено:', savedWord);

        res.json({ 
            success: true, 
            message: 'Слово успешно отмечено',
            isMarked: true 
        });
        console.log('=== Сохранение слова завершено успешно ===');
    } catch (error) {
        console.error('Ошибка при сохранении отмеченного слова:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка при сохранении слова',
            error: error.message 
        });
    }
});

// Эндпоинт для удаления отмеченного слова
app.delete('/api/marked-words', async (req, res) => {
    try {
        console.log('=== Начало удаления отмеченного слова ===');
        const { userId, word } = req.body;
        console.log('Получены данные:', { userId, word });

        if (!userId || !word) {
            console.log('Отсутствуют обязательные параметры');
            return res.status(400).json({
                success: false,
                message: 'Отсутствуют обязательные параметры'
            });
        }

        console.log('Удаление слова...');
        const deletedWord = await markedWordsQueries.removeMarkedWord(userId, word);
        console.log('Слово удалено:', deletedWord);

        res.json({ 
            success: true, 
            message: 'Слово успешно удалено',
            isMarked: false 
        });
        console.log('=== Удаление слова завершено успешно ===');
    } catch (error) {
        console.error('Ошибка при удалении отмеченного слова:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка при удалении слова',
            error: error.message 
        });
    }
});

// Эндпоинт для получения всех отмеченных слов пользователя
app.get('/api/marked-words/:userId', async (req, res) => {
    try {
        console.log('=== Начало получения отмеченных слов ===');
        const userId = req.params.userId;
        console.log('ID пользователя:', userId);

        if (!userId) {
            console.log('Отсутствует ID пользователя');
            return res.status(400).json({
                success: false,
                message: 'Отсутствует ID пользователя'
            });
        }

        console.log('Получение слов...');
        const words = await markedWordsQueries.getMarkedWords(userId);
        console.log('Получены слова:', words);

        res.json({ 
            success: true, 
            words: words 
        });
        console.log('=== Получение слов завершено успешно ===');
    } catch (error) {
        console.error('Ошибка при получении отмеченных слов:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка при получении слов',
            error: error.message 
        });
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