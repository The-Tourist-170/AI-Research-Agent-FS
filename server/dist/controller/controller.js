"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResearchTaskById = exports.getAllResearchTasks = exports.createResearchTask = exports.checkRateLimit = void 0;
const genai_1 = require("@google/genai");
const dbOperations_1 = require("../db/dbOperations");
const queue_1 = __importDefault(require("../db/queue"));
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new genai_1.GoogleGenAI({ apiKey });
const checkRateLimit = async (req, res) => {
    try {
        console.log('Pinging Gemini API to check rate limit status...');
        const response = await genAI.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: "This is a Test"
        });
        return res.status(200).json({ limitReached: false });
    }
    catch (error) {
        if (error.message && error.message.includes('429')) {
            return res.status(429).json({ limitReached: true, error: 'Free tier limit exceeded' });
        }
        else {
            return res.status(500).json({
                limitReached: false,
                message: 'An internal server error occurred while checking API status.',
                details: error.message,
            });
        }
    }
};
exports.checkRateLimit = checkRateLimit;
const createResearchTask = async (req, res) => {
    const { topic } = req.body;
    if (typeof topic !== 'string' || topic.trim() === '') {
        return res.status(400).json({ error: 'Invalid topic' });
    }
    try {
        const taskId = await (0, dbOperations_1.createTask)(topic);
        await queue_1.default.add('research', { taskId, topic }, { attempts: 3, backoff: { type: 'exponential', delay: 5000 } });
        res.status(201).json({ id: taskId });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.createResearchTask = createResearchTask;
const getAllResearchTasks = async (req, res) => {
    try {
        const tasks = await (0, dbOperations_1.getAllTasks)();
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getAllResearchTasks = getAllResearchTasks;
const getResearchTaskById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    try {
        const details = await (0, dbOperations_1.getTaskDetails)(id);
        res.json(details);
    }
    catch (error) {
        if (error.message === 'Task not found') {
            res.status(404).json({ error: 'Task not found' });
        }
        else {
            res.status(500).json({ error: 'Server error' });
        }
    }
};
exports.getResearchTaskById = getResearchTaskById;
