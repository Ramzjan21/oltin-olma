import pool from '../config/database';

export interface Transaction {
  id: number;
  user_id: number;
  type: 'purchase' | 'reward' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method?: string;
  payment_id?: string;
  description?: string;
  created_at: Date;
}

export class TransactionModel {
  static async create(
    userId: number,
    type: string,
    amount: number,
    status: string = 'pending',
    paymentMethod?: string,
    paymentId?: string,
    description?: string
  ): Promise<Transaction> {
    const result = await pool.query(
      `INSERT INTO transactions (user_id, type, amount, status, payment_method, payment_id, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [userId, type, amount, status, paymentMethod, paymentId, description]
    );
    return result.rows[0];
  }

  static async updateStatus(transactionId: number, status: string): Promise<void> {
    await pool.query(
      'UPDATE transactions SET status = $1 WHERE id = $2',
      [status, transactionId]
    );
  }

  static async getByUserId(userId: number): Promise<Transaction[]> {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  static async getTotalRevenue(): Promise<number> {
    const result = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
       WHERE type = 'purchase' AND status = 'completed'`
    );
    return parseFloat(result.rows[0].total);
  }

  static async getAll(): Promise<Transaction[]> {
    const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
    return result.rows;
  }
}
