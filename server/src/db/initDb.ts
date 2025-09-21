import { getPool } from './pool';

export async function initDb() {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS research_tasks (
      id SERIAL PRIMARY KEY,
      topic TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS logs (
      id SERIAL PRIMARY KEY,
      task_id INTEGER REFERENCES research_tasks(id),
      step TEXT,
      message TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS results (
      id SERIAL PRIMARY KEY,
      task_id INTEGER REFERENCES research_tasks(id),
      articles JSONB
    );
  `);

  console.log('Tables created or already exist');
}