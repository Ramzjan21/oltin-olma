import pool from '../config/database';

export interface Tree {
  id: number;
  user_id: number;
  level: number;
  status: 'active' | 'dead' | 'completed';
  apple_count: number;
  purchase_date: Date;
  last_collection_time?: Date;
  week_start_date: Date;
  days_collected: number;
  created_at: Date;
  updated_at: Date;
}

export class TreeModel {
  static async create(userId: number, level: number = 1): Promise<Tree> {
    const result = await pool.query(
      `INSERT INTO trees (user_id, level, status, apple_count, week_start_date) 
       VALUES ($1, $2, 'active', 0, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [userId, level]
    );
    return result.rows[0];
  }

  static async findActiveByUserId(userId: number): Promise<Tree | null> {
    const result = await pool.query(
      `SELECT * FROM trees WHERE user_id = $1 AND status = 'active' ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    return result.rows[0] || null;
  }

  static async findById(treeId: number): Promise<Tree | null> {
    const result = await pool.query('SELECT * FROM trees WHERE id = $1', [treeId]);
    return result.rows[0] || null;
  }

  static async updateAppleCount(treeId: number, count: number): Promise<void> {
    await pool.query(
      `UPDATE trees SET apple_count = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [count, treeId]
    );
  }

  static async updateLastCollection(treeId: number, daysCollected: number): Promise<void> {
    await pool.query(
      `UPDATE trees SET last_collection_time = CURRENT_TIMESTAMP, days_collected = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [daysCollected, treeId]
    );
  }

  static async updateStatus(treeId: number, status: string): Promise<void> {
    await pool.query(
      `UPDATE trees SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [status, treeId]
    );
  }

  static async getAllByUserId(userId: number): Promise<Tree[]> {
    const result = await pool.query(
      'SELECT * FROM trees WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  static async getAll(): Promise<Tree[]> {
    const result = await pool.query('SELECT * FROM trees ORDER BY created_at DESC');
    return result.rows;
  }

  static async countActive(): Promise<number> {
    const result = await pool.query('SELECT COUNT(*) as count FROM trees WHERE status = $1', ['active']);
    return parseInt(result.rows[0].count);
  }
}
