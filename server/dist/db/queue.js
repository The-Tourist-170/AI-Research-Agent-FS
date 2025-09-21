"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const researchQueue = new bull_1.default('research', process.env.REDIS_URL || 'redis://localhost:6379', {
    defaultJobOptions: { attempts: 3, backoff: 5000 },
    redis: { connectTimeout: 5000 }
});
exports.default = researchQueue;
