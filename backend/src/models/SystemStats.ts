import pool from '../config/database';

export interface SystemStats {
  id: number;
  total_revenue: number;
  total_rewards_paid: number;
  total_profit: number;
  active_trees: number;
  total_users: number;
  updated_at: Date;
}

export class SystemStatsModel {
  static async get(): Promise<SystemStats> {
    const result = await pool.query('SELECT * FROM system_stats LIMIT 1');
    return result.rows[0];
  }

  static async update(
    totalRevenue: number,
    totalRewardsPaid: number,
    activeTrees: number,
    totalUsers: number
  ): Promise<void> {
    const totalProfit = totalRevenue - totalRewardsPaid;
    await pool.query(
      `UPDATE system_stats SET 
       total_revenue = $1, 
       total_rewards_paid = $2, 
       total_profit = $3, 
       active_trees = $4, 
       total_users = $5,
       updated_at = CURRENT_TIMESTAMP`,
      [totalRevenue, totalRewardsPaid, totalProfit, activeTrees, totalUsers]
    );
  }

  static async incrementRevenue(amount: number): Promise<void> {
    await pool.query(
      `UPDATE system_stats SET 
       total_revenue = total_revenue + $1,
       total_profit = total_profit + $1,
       updated_at = CURRENT_TIMESTAMP`,
      [amount]
    );
  }

  static async incrementRewardsPaid(amount: number): Promise<void> {
    await pool.query(
      `UPDATE system_stats SET 
       total_rewards_paid = total_rewards_paid + $1,
       total_profit = total_profit - $1,
       updated_at = CURRENT_TIMESTAMP`,
      [amount]
    );
  }
}
