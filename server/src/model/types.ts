import { z } from 'zod';

export interface Task {
  id: number;
  topic: string;
  status: string;
  created_at: Date;
}

export interface Log {
  step: string;
  message: string;
  timestamp: Date;
}

export interface Article {
  title: string;
  summary: string;
  keywords: string[];
}

export interface Result {
  articles: Article[];
  report: string;
}

export const TopicSchema = z.object({
  topic: z.string().trim().min(1, 'Topic cannot be empty')
});