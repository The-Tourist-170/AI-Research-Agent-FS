import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function refineQuery(topic: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `I am using News API for getting articles on a certain topic, and them use them for further parsing. Your task is that I will provide you the topic, and you need to return me the refined version, like a keyword, so that when I pass it to the news api, it does not return me empty array. Also only directly return the keyword. Topic: ${topic}`
    });
    return response.text?.trim() || '';
  } catch (error: any) {
    console.error(error);
    return topic;
  }
}

export async function summarizeAndExtractKeywords(article: any): Promise<{ summary: string, keywords: string[] }> {
  try {
    const text = article.title + '\n' + (article.snippet || '');
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Summarize this article in 100 words: ${text}\nExtract 5 top keywords. Now I want your response in a specific json format, for further parsing. Format as: {Summary: [text], Keywords: [key1, key2, key3, key4, key5]}`
    });
    let json: string = response.text || "";
    const jsonStart = json.indexOf('{');
    const jsonEnd = json.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1) {
      json = json.substring(jsonStart, jsonEnd + 1);
    }

    const parsed = JSON.parse(json);
    const summary = parsed.Summary;
    const keywords = parsed.Keywords;
    return { summary, keywords };
  } catch (error: any) {
    console.error(error);
    return { summary: "", keywords: [] };
  }
}

export async function generateReport(summaries: string[]): Promise<string> {
  const text = summaries.join('\n\n');
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: `Synthesize these article summaries into a cohesive research report with insights, trends, and conclusions: ${text}. Properly format the report, give a line space between para change and points, keep it clean. Provide markdown. Directly give report, no ok, here is the report, or any welcome needed.`
  });
  return response.text?.trim() || '';
}