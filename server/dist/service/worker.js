"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const bullmq_1 = require("bullmq");
const apiFetch_1 = require("../utils/apiFetch");
const gemini_1 = require("../utils/gemini");
const dbOperations_1 = require("../db/dbOperations");
new bullmq_1.Worker('research', async (job) => {
    const { taskId, topic } = job.data;
    await (0, dbOperations_1.addLog)(taskId, 'Step 1', 'Refine: Refining query with AI.');
    const refinedTopic = await (0, gemini_1.refineQuery)(topic);
    await (0, dbOperations_1.addLog)(taskId, 'Step 2', 'Input Parsing: Validated and stored request. Refined to: ' + refinedTopic);
    await (0, dbOperations_1.updateTaskStatus)(taskId, 'processing');
    await (0, dbOperations_1.addLog)(taskId, 'Step 3', 'Data Gathering: Fetching articles from API using refined topic.');
    const articles = await (0, apiFetch_1.fetchArticles)(refinedTopic);
    await (0, dbOperations_1.addLog)(taskId, 'Step 4', 'Processing: Summarizing and extracting keywords with AI.');
    const promises = articles.map(article => (0, gemini_1.summarizeAndExtractKeywords)(article));
    const results = await Promise.all(promises);
    const processed = results.map((res, index) => ({
        title: articles[index].title,
        summary: res.summary,
        keywords: res.keywords
    }));
    await (0, dbOperations_1.addLog)(taskId, 'Step 5', 'Report: Generating research report with AI.');
    const summaries = processed.map(p => p.summary);
    const report = await (0, gemini_1.generateReport)(summaries);
    await (0, dbOperations_1.addLog)(taskId, 'Step 6', 'Result Persistence: Saving processed results and report.');
    await (0, dbOperations_1.saveResults)(taskId, { articles: processed, report });
    await (0, dbOperations_1.updateTaskStatus)(taskId, 'completed');
}, {
    connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10)
    }
});
