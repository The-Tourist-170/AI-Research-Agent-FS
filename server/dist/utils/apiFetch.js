"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchArticles = fetchArticles;
const node_fetch_1 = __importDefault(require("node-fetch"));
async function fetchArticles(topic) {
    try {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&apiKey=${process.env.NEWS_API_KEY}&pageSize=5`;
        const response = await (0, node_fetch_1.default)(url);
        const data = await response.json();
        return data.articles;
    }
    catch (error) {
        console.error(error);
        return [];
    }
}
