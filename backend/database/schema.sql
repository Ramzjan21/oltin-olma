-- Database Schema for Golden Apple Tree

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    balance DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trees Table
CREATE TABLE trees (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'active', -- active, dead, completed
    apple_count INTEGER DEFAULT 0,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_collection_time TIMESTAMP,
    week_start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    days_collected INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Collections Table (Track each apple collection)
CREATE TABLE collections (
    id SERIAL PRIMARY KEY,
    tree_id INTEGER REFERENCES trees(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    collection_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    apples_collected INTEGER DEFAULT 1,
    day_number INTEGER
);

-- Rewards Table
CREATE TABLE rewards (
    id SERIAL PRIMARY KEY,
    tree_id INTEGER REFERENCES trees(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reward_amount DECIMAL(10, 2) NOT NULL,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- purchase, reward, withdrawal
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Stats Table (for profit tracking)
CREATE TABLE system_stats (
    id SERIAL PRIMARY KEY,
    total_revenue DECIMAL(15, 2) DEFAULT 0,
    total_rewards_paid DECIMAL(15, 2) DEFAULT 0,
    total_profit DECIMAL(15, 2) DEFAULT 0,
    active_trees INTEGER DEFAULT 0,
    total_users INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial system stats
INSERT INTO system_stats (total_revenue, total_rewards_paid, total_profit, active_trees, total_users)
VALUES (0, 0, 0, 0, 0);

-- Indexes for performance
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_trees_user_id ON trees(user_id);
CREATE INDEX idx_trees_status ON trees(status);
CREATE INDEX idx_collections_tree_id ON collections(tree_id);
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_rewards_user_id ON rewards(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
