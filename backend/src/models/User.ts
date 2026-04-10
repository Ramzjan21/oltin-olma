import pool from '../config/database';

export interface User {
  id: number;
  telegram_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_admin: boolean;
  is_banned: boolean;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static async findByTelegramId(telegramId: number): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE telegram_id = $1',
      [telegramId]
    );
    return result.rows[0] || null;
  }

  static async create(telegramId: number, username?: string, firstName?: string, lastName?: string): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (telegram_id, username, first_name, last_name) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [telegramId, username, firstName, lastName]
    );
    return result.rows[0];
  }

  static async findById(id: number): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async updateBalance(userId: number, amount: number): Promise<void> {
    await pool.query(
      'UPDATE users SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [amount, userId]
    );
  }

  static async getAll(): Promise<User[]> {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  }

  static async banUser(userId: number, banned: boolean): Promise<void> {
    await pool.query(
      'UPDATE users SET is_banned = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [banned, userId]
    );
  }
}
