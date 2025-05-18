-- Создаем пользователя для приложения
CREATE USER dictionary_app_main WITH PASSWORD '1458';

-- Создаем базу данных
CREATE DATABASE dictionary_db;

-- Подключаемся к созданной базе данных
\c dictionary_db;

-- Предоставляем права пользователю на базу данных
GRANT ALL PRIVILEGES ON DATABASE dictionary_db TO dictionary_app_main;

-- Создаем схему public если её нет
CREATE SCHEMA IF NOT EXISTS public;

-- Предоставляем права на схему
GRANT ALL ON SCHEMA public TO dictionary_app_main;

-- Удаляем существующие таблицы, если они есть
DROP TABLE IF EXISTS marked_words;
DROP TABLE IF EXISTS game_progress;
DROP TABLE IF EXISTS users;

-- Создаем таблицу пользователей
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Создаем таблицу для отмеченных слов
CREATE TABLE marked_words (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    word VARCHAR(100) NOT NULL,
    translation TEXT,
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, word)
);

-- Создаем таблицу для прогресса игры
CREATE TABLE game_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    level INTEGER NOT NULL,
    score INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, level)
);

-- Создаем индексы для оптимизации запросов
CREATE INDEX idx_marked_words_user_id ON marked_words(user_id);
CREATE INDEX idx_game_progress_user_id ON game_progress(user_id);

-- Предоставляем права на все таблицы
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dictionary_app_main;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO dictionary_app_main;