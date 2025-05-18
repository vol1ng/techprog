const { Pool } = require('pg');

// Конфигурация подключения к базе данных
const pool = new Pool({
    user: 'dictionary_app_main',
    host: 'localhost',
    database: 'dictionary_db',
    password: '1458',
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

// Запросы для работы с пользователями
const userQueries = {
    findUserByEmail: async (email) => {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    },

    registerUser: async (email, passwordHash, username) => {
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING *',
            [email, passwordHash, username]
        );
        return result.rows[0];
    },

    updateLastLogin: async (userId) => {
        await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1', [userId]);
    }
};

// Запросы для работы с отмеченными словами
const markedWordsQueries = {
    addMarkedWord: async (userId, word) => {
        const query = `
            INSERT INTO marked_words (user_id, word)
            VALUES ($1, $2)
            RETURNING *
        `;
        const result = await pool.query(query, [userId, word]);
        return result.rows[0];
    },

    removeMarkedWord: async (userId, word) => {
        const query = `
            DELETE FROM marked_words
            WHERE user_id = $1 AND word = $2
            RETURNING *
        `;
        const result = await pool.query(query, [userId, word]);
        return result.rows[0];
    },

    getMarkedWords: async (userId) => {
        console.log('=== Начало получения отмеченных слов из БД ===');
        console.log('ID пользователя:', userId);
        try {
            const query = `
                SELECT word
                FROM marked_words
                WHERE user_id = $1
                ORDER BY marked_at DESC
            `;
            console.log('Выполняем SQL запрос:', query);
            const result = await pool.query(query, [userId]);
            console.log('Результат запроса:', result.rows);
            console.log('=== Получение отмеченных слов завершено успешно ===');
            return result.rows;
        } catch (error) {
            console.error('Ошибка при получении отмеченных слов из БД:', error);
            throw error;
        }
    },

    findMarkedWord: async (userId, word) => {
        const query = `
            SELECT *
            FROM marked_words
            WHERE user_id = $1 AND word = $2
        `;
        const result = await pool.query(query, [userId, word]);
        return result.rows[0];
    }
};

// Запросы для работы с прогрессом игры
const gameProgressQueries = {
    saveProgress: async (userId, level, score, completed) => {
        const result = await pool.query(
            `INSERT INTO game_progress (user_id, level, score, completed) 
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id, level) 
             DO UPDATE SET score = $3, completed = $4, last_played = CURRENT_TIMESTAMP
             RETURNING *`,
            [userId, level, score, completed]
        );
        return result.rows[0];
    },

    getProgress: async (userId) => {
        const result = await pool.query(
            'SELECT * FROM game_progress WHERE user_id = $1 ORDER BY level',
            [userId]
        );
        return result.rows;
    },

    getLevelProgress: async (userId, level) => {
        const result = await pool.query(
            'SELECT * FROM game_progress WHERE user_id = $1 AND level = $2',
            [userId, level]
        );
        return result.rows[0];
    }
};

// Экспорт функций
module.exports = {
    testConnection,
    userQueries,
    markedWordsQueries,
    gameProgressQueries,
    pool
}; 