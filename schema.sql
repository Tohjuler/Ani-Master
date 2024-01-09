CREATE TABLE IF NOT EXISTS user (
    id VARCHAR(15) PRIMARY KEY,
    username VARCHAR(31) NOT NULL UNIQUE,
    -- Settings
    default_provider_anime VARCHAR(100) NOT NULL DEFAULT 'gogoanime',
    default_dubbed BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS user_key (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(15) NOT NULL,
    hashed_password VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS user_session (
    id VARCHAR(127) PRIMARY KEY,
    user_id VARCHAR(15) NOT NULL,
    active_expires BIGINT NOT NULL,
    idle_expires BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Anime Watch Tables

CREATE TABLE IF NOT EXISTS anime_watch (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(15) NOT NULL,
    anime_id VARCHAR(127) NOT NULL,
    current_episode VARCHAR(127) NOT NULL,
    current_progress INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
