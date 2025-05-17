const { Pool } = require('pg');

// Конфигурация подключения к базе данных
const pool = new Pool({
    user: 'dictionary_app',
    host: 'localhost',
    database: 'tp_project',
    password: 'your_secure_password',
    port: 5432,
});

// Функция для проверки подключения
async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Успешное подключение к базе данных');
        client.release();
    } catch (err) {
        console.error('Ошибка подключения к базе данных:', err);
    }
}

// Функции для работы с пользователями
const userQueries = {
    // Регистрация нового пользователя
    async registerUser(email, passwordHash, username) {
        try {
            const result = await pool.query(
                'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING user_id',
                [email, passwordHash, username]
            );
            return result.rows[0];
        } catch (err) {
            console.error('Ошибка при регистрации пользователя:', err);
            throw err;
        }
    },

    // Поиск пользователя по email
    async findUserByEmail(email) {
        try {
            const result = await pool.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            return result.rows[0];
        } catch (err) {
            console.error('Ошибка при поиске пользователя:', err);
            throw err;
        }
    },

    // Обновление времени последнего входа
    async updateLastLogin(userId) {
        try {
            await pool.query(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1',
                [userId]
            );
        } catch (err) {
            console.error('Ошибка при обновлении времени входа:', err);
            throw err;
        }
    }
};

// Функции для работы с помеченными словами
const markedWordsQueries = {
    // Добавление помеченного слова
    async addMarkedWord(userId, word, translation, language) {
        try {
            const result = await pool.query(
                'INSERT INTO marked_words (user_id, word, translation, language) VALUES ($1, $2, $3, $4) RETURNING mark_id',
                [userId, word, translation, language]
            );
            return result.rows[0];
        } catch (err) {
            console.error('Ошибка при добавлении помеченного слова:', err);
            throw err;
        }
    },

    // Получение всех помеченных слов пользователя
    async getMarkedWords(userId) {
        try {
            const result = await pool.query(
                'SELECT * FROM marked_words WHERE user_id = $1 ORDER BY marked_at DESC',
                [userId]
            );
            return result.rows;
        } catch (err) {
            console.error('Ошибка при получении помеченных слов:', err);
            throw err;
        }
    },

    // Удаление помеченного слова
    async removeMarkedWord(userId, word, language) {
        try {
            await pool.query(
                'DELETE FROM marked_words WHERE user_id = $1 AND word = $2 AND language = $3',
                [userId, word, language]
            );
        } catch (err) {
            console.error('Ошибка при удалении помеченного слова:', err);
            throw err;
        }
    }
};

// Функции для работы с историей поиска
const searchHistoryQueries = {
    // Добавление записи в историю поиска
    async addSearchHistory(userId, word, language) {
        try {
            await pool.query(
                'INSERT INTO search_history (user_id, word, language) VALUES ($1, $2, $3)',
                [userId, word, language]
            );
        } catch (err) {
            console.error('Ошибка при добавлении в историю поиска:', err);
            throw err;
        }
    },

    // Получение истории поиска пользователя
    async getSearchHistory(userId, limit = 10) {
        try {
            const result = await pool.query(
                'SELECT * FROM search_history WHERE user_id = $1 ORDER BY searched_at DESC LIMIT $2',
                [userId, limit]
            );
            return result.rows;
        } catch (err) {
            console.error('Ошибка при получении истории поиска:', err);
            throw err;
        }
    }
};

// Экспорт функций
module.exports = {
    testConnection,
    userQueries,
    markedWordsQueries,
    searchHistoryQueries,
    pool
}; 