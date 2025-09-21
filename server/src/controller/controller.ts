import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { configDotenv } from 'dotenv';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { createTask, getAllTasks, getTaskDetails } from '../db/dbOperations';
import researchQueue from '../db/queue';

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenAI({ apiKey });

export const checkRateLimit = async (req: express.Request, res: express.Response) => {
    try {
        console.log('Pinging Gemini API to check rate limit status...');
        const response = await genAI.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: "This is a Test"
        });
        return res.status(200).json({ limitReached: false });
    } catch (error: any) {
        if (error.message && error.message.includes('429')) {
            return res.status(429).json({ limitReached: true, error: 'Free tier limit exceeded' });
        } else {
            return res.status(500).json({
                limitReached: false,
                message: 'An internal server error occurred while checking API status.',
                details: error.message,
            });
        }
    }
};

export const createResearchTask = async (req: express.Request, res: express.Response) => {
    const { topic } = req.body;
    if (typeof topic !== 'string' || topic.trim() === '') {
        return res.status(400).json({ error: 'Invalid topic' });
    }
    try {
        const taskId = await createTask(topic);
        await researchQueue.add('research', { taskId, topic }, { attempts: 3, backoff: { type: 'exponential', delay: 5000 } });
        res.status(201).json({ id: taskId });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getAllResearchTasks = async (req: express.Request, res: express.Response) => {
    try {
        const tasks = await getAllTasks();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getResearchTaskById = async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    try {
        const details = await getTaskDetails(id);
        res.json(details);
    } catch (error: any) {
        if (error.message === 'Task not found') {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
};