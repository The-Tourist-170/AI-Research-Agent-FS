import fetch from 'node-fetch';

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: any[];
}

export async function fetchArticles(topic: string): Promise<any[]> {
  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&apiKey=${process.env.NEWS_API_KEY}&pageSize=5`;
    const response = await fetch(url);
    const data: NewsApiResponse = await response.json() as NewsApiResponse;
    return data.articles;
  } catch (error: any) {
    console.error(error);
    return [];
  }
}