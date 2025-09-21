"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refineQuery = refineQuery;
exports.summarizeAndExtractKeywords = summarizeAndExtractKeywords;
exports.generateReport = generateReport;
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function refineQuery(topic) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `I am using News API for getting articles on a certain topic, and them use them for further parsing. Your task is that I will provide you the topic, and you need to return me the refined version, like a keyword, so that when I pass it to the news api, it does not return me empty array. Also only directly return the keyword. Topic: ${topic}`
        });
        return response.text?.trim() || '';
    }
    catch (error) {
        console.error(error);
        return topic;
    }
}
async function summarizeAndExtractKeywords(article) {
    try {
        const text = article.title + '\n' + (article.snippet || '');
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `Summarize this article in 100 words: ${text}\nExtract 5 top keywords. Now I want your response in a specific json format, for further parsing. Format as: {Summary: [text], Keywords: [key1, key2, key3, key4, key5]}`
        });
        let json = response.text || "";
        const jsonStart = json.indexOf('{');
        const jsonEnd = json.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            json = json.substring(jsonStart, jsonEnd + 1);
        }
        const parsed = JSON.parse(json);
        const summary = parsed.Summary;
        const keywords = parsed.Keywords;
        return { summary, keywords };
    }
    catch (error) {
        console.error(error);
        return { summary: "", keywords: [] };
    }
}
async function generateReport(summaries) {
    const text = summaries.join('\n\n');
    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: `Synthesize these article summaries into a cohesive research report with insights, trends, and conclusions: ${text}. Properly format the report, give a line space between para change and points, keep it clean. Provide markdown. Directly give report, no ok, here is the report, or any welcome needed.`
    });
    return response.text?.trim() || '';
}
