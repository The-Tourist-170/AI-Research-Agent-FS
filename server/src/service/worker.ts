import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { fetchArticles } from '../utils/apiFetch';
import { generateReport, refineQuery, summarizeAndExtractKeywords } from '../utils/gemini';
import { addLog, saveResults, updateTaskStatus } from '../db/dbOperations';

// Create a Redis connection instance using the URL from environment variables.
// This single URL works for both local and Render deployments.
const redisConnection = new Redis(process.env.REDIS_URL!, { 
    maxRetriesPerRequest: null // Recommended setting for BullMQ
});

// The worker is created and starts listening as soon as this file is executed.
new Worker<{ taskId: number; topic: string }, void>('research', async (job) => {
  const { taskId, topic } = job.data;
  
  await addLog(taskId, 'Step 1', 'Refine: Refining query with AI.');
  const refinedTopic = await refineQuery(topic);
  
  await addLog(taskId, 'Step 2', 'Input Parsing: Validated and stored request. Refined to: ' + refinedTopic);
  await updateTaskStatus(taskId, 'processing');

  await addLog(taskId, 'Step 3', 'Data Gathering: Fetching articles from API using refined topic.');
  const articles = await fetchArticles(refinedTopic);

  await addLog(taskId, 'Step 4', 'Processing: Summarizing and extracting keywords with AI.');
  const promises = articles.map(article => summarizeAndExtractKeywords(article));
  const results = await Promise.all(promises);
  const processed = results.map((res, index) => ({
    title: articles[index].title,
    summary: res.summary,
    keywords: res.keywords
  }));

  await addLog(taskId, 'Step 5', 'Report: Generating research report with AI.');
  const summaries = processed.map(p => p.summary);
  const report = await generateReport(summaries);

  await addLog(taskId, 'Step 6', 'Result Persistence: Saving processed results and report.');
  await saveResults(taskId, {articles: processed, report});

  await updateTaskStatus(taskId, 'completed');
}, {
  connection: redisConnection
});

console.log("Worker process started and is listening for jobs.");