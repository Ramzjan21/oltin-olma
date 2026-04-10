import pool from '../config/database';

export interface Reward {
  id: number;
  tree_id: number;
  user_id: number;
  reward_amount: number;
  claimed_at: Date;
}

export class RewardModel {
  static async create(treeId: number, userId: number, rewardAmount: number): Promise<Reward> {
    const result = await pool.query(
      `INSERT INTO rewards (tree_id, user_id, reward_amount) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [treeId, userId, rewardAmount]
    );
    return result.rows[0];
  }

  static async getByUserId(userId: number): Promise<Reward[]> {
    const result = await pool.query(
      'SELECT * FROM rewards WHERE user_id = $1 ORDER BY claimed_at DESC',
      [userId]
    );
    return result.rows;
  }

  static async getTotalPaid(): Promise<number> {
    const result = await pool.query('SELECT COALESCE(SUM(reward_amount), 0) as total FROM rewards');
    return parseFloat(result.rows[0].total);
  }

  static async getAll(): Promise<Reward[]> {
    const result = await pool.query('SELECT * FROM rewards ORDER BY claimed_at DESC');
    return result.rows;
  }
}
