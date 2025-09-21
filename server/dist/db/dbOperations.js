"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = createTask;
exports.getAllTasks = getAllTasks;
exports.updateTaskStatus = updateTaskStatus;
exports.addLog = addLog;
exports.saveResults = saveResults;
exports.getTaskDetails = getTaskDetails;
const pool_1 = require("./pool");
async function createTask(topic) {
    const pool = (0, pool_1.getPool)();
    const result = await pool.query('INSERT INTO research_tasks (topic, status) VALUES ($1, $2) RETURNING id', [topic, 'pending']);
    return result.rows[0].id;
}
async function getAllTasks() {
    const pool = (0, pool_1.getPool)();
    const result = await pool.query('SELECT id, topic, status FROM research_tasks ORDER BY created_at DESC');
    return result.rows;
}
async function updateTaskStatus(taskId, status) {
    const pool = (0, pool_1.getPool)();
    await pool.query('UPDATE research_tasks SET status = $1 WHERE id = $2', [status, taskId]);
}
async function addLog(taskId, step, message) {
    const pool = (0, pool_1.getPool)();
    await pool.query('INSERT INTO logs (task_id, step, message) VALUES ($1, $2, $3)', [taskId, step, message]);
}
async function saveResults(taskId, data) {
    const pool = (0, pool_1.getPool)();
    await pool.query('INSERT INTO results (task_id, articles) VALUES ($1, $2)', [taskId, data]);
}
async function getTaskDetails(id) {
    const pool = (0, pool_1.getPool)();
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
    }
    finally {
        client.release();
    }
}
