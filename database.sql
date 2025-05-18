-- Создание таблицы пользователей
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Создание таблицы для помеченных слов пользователя
CREATE TABLE marked_words (
    mark_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    word VARCHAR(255) NOT NULL,
    translation TEXT,
    language VARCHAR(10) NOT NULL, -- 'en' или 'ru'
    marked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, word, language)
);

-- Создание таблицы для истории поиска
CREATE TABLE search_history (
    search_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    word VARCHAR(255) NOT NULL,
    language VARCHAR(10) NOT NULL, -- 'en' или 'ru'
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для оптимизации поиска
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_marked_words_user_id ON marked_words(user_id);
CREATE INDEX idx_search_history_user_id ON search_history(user_id);

-- Создание представления для статистики пользователя
CREATE VIEW user_statistics AS
SELECT 
    u.user_id,
    u.username,
    u.email,
    COUNT(DISTINCT mw.mark_id) as total_marked_words,
    COUNT(DISTINCT sh.search_id) as total_searches,
    MAX(sh.searched_at) as last_search_date
FROM users u
LEFT JOIN marked_words mw ON u.user_id = mw.user_id
LEFT JOIN search_history sh ON u.user_id = sh.user_id
GROUP BY u.user_id, u.username, u.email;

-- Добавление комментариев к таблицам
COMMENT ON TABLE users IS 'Таблица пользователей системы';
COMMENT ON TABLE marked_words IS 'Таблица помеченных слов пользователей';
COMMENT ON TABLE search_history IS 'История поиска пользователей';
COMMENT ON VIEW user_statistics IS 'Статистика использования системы пользователями';

-- Создание роли для приложения
CREATE ROLE dictionary_app WITH LOGIN PASSWORD 'your_secure_password';

-- Предоставление прав на таблицы
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO dictionary_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO dictionary_app;