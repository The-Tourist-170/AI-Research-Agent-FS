import { getPool } from './pool';
import { Article } from '../model/types';

export async function createTask(topic: string): Promise<number> {
  const pool = getPool();
  const result = await pool.query(
    'INSERT INTO research_tasks (topic, status) VALUES ($1, $2) RETURNING id',
    [topic, 'pending']
  );
  return result.rows[0].id;
}

export async function getAllTasks(): Promise<any[]> {
  const pool = getPool();
  const result = await pool.query('SELECT id, topic, status FROM research_tasks ORDER BY created_at DESC');
  return result.rows;
}

export async function updateTaskStatus(taskId: number, status: string): Promise<void> {
  const pool = getPool();
  await pool.query('UPDATE research_tasks SET status = $1 WHERE id = $2', [status, taskId]);
}

export async function addLog(taskId: number, step: string, message: string): Promise<void> {
  const pool = getPool();
  await pool.query('INSERT INTO logs (task_id, step, message) VALUES ($1, $2, $3)', [taskId, step, message]);
}

export async function saveResults(taskId: number, data: { articles: Article[]; report: string }): Promise<void> {
  const pool = getPool();
  await pool.query('INSERT INTO results (task_id, articles) VALUES ($1, $2)', [taskId, data]);
}

export async function getTaskDetails(id: number): Promise<any> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    const taskResult = await client.query('SELECT * FROM research_tasks WHERE id = $1', [id]);
    if (taskResult.rows.length === 0) {
      throw new Error('Task not found');
    }
    
    const logsResult = await client.query('SELECT step, message, timestamp FROM logs WHERE task_id = $1 ORDER BY timestamp', [id]);
    const resultsResult = await client.query('SELECT articles FROM results WHERE task_id = $1', [id]);
    
    return {
      task: taskResult.rows[0],
      logs: logsResult.rows,
      results: resultsResult.rows[0] ? resultsResult.rows[0].articles : null
    };
  } finally {
    client.release();
  }
}