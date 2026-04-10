import pool from '../config/database';

export interface Collection {
  id: number;
  tree_id: number;
  user_id: number;
  collection_time: Date;
  apples_collected: number;
  day_number: number;
}

export class CollectionModel {
  static async create(treeId: number, userId: number, dayNumber: number, applesCollected: number = 1): Promise<Collection> {
    const result = await pool.query(
      `INSERT INTO collections (tree_id, user_id, day_number, apples_collected) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [treeId, userId, dayNumber, applesCollected]
    );
    return result.rows[0];
  }

  static async getByTreeId(treeId: number): Promise<Collection[]> {
    const result = await pool.query(
      'SELECT * FROM collections WHERE tree_id = $1 ORDER BY collection_time ASC',
      [treeId]
    );
    return result.rows;
  }

  static async getTodayCollections(treeId: number): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM collections 
       WHERE tree_id = $1 AND DATE(collection_time) = CURRENT_DATE`,
      [treeId]
    );
    return parseInt(result.rows[0].count);
  }
}
