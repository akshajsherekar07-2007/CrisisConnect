// News service — fetches crisis-related news from India
// Uses GNews free tier with fallback to mock data

import { demoNewsItems } from '../data';

const GNEWS_API_KEY = '4e68f2a704e7097e8fc4db0d49ece5da';
const GNEWS_URL = 'https://gnews.io/api/v4/search';

let cachedNews = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export const fetchCrisisNews = async () => {
  // Return cached data if still fresh
  if (cachedNews && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedNews;
  }

  try {
    const params = new URLSearchParams({
      q: 'crisis OR disaster OR flood OR earthquake OR cyclone India',
      lang: 'en',
      country: 'in',
      max: '10',
      apikey: GNEWS_API_KEY,
    });

    const response = await fetch(`${GNEWS_URL}?${params}`);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      cachedNews = data.articles.map((article, i) => ({
        id: `news-${i}`,
        title: article.title,
        source: article.source?.name || 'News',
        publishedAt: new Date(article.publishedAt).getTime(),
        url: article.url,
        description: article.description || '',
      }));
      cacheTimestamp = Date.now();
      return cachedNews;
    }

    throw new Error('No articles returned');
  } catch (error) {
    console.warn('News API unavailable, using mock data:', error.message);
    // Return mock news as fallback
    cachedNews = demoNewsItems;
    cacheTimestamp = Date.now();
    return demoNewsItems;
  }
};
