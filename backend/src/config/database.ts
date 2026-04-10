import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ PostgreSQL ulanish xatosi:', err.message);
  } else {
    console.log('✅ PostgreSQL ga muvaffaqiyatli ulandi');
    console.log('📅 Database vaqti:', res.rows[0].now);
  }
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL xatosi:', err);
  process.exit(-1);
});

export default pool;
