import { bento } from '@/app/services/cache';
import { config } from '@/config';

const BING_TRANSLATE_ENDPOINT =
  'https://api.cognitive.microsofttranslator.com/translate';
const BING_TRANSLATE_CACHE_KEY = 'bing-translate';

export async function translateWithBing(text: string) {
  const cacheKey = `${BING_TRANSLATE_CACHE_KEY}:${text}`;

  return bento.getOrSet(
    cacheKey,
    async () => {
      const response = await fetch(
        `${BING_TRANSLATE_ENDPOINT}?api-version=3.0&to=en`,
        {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': config.bingApiKey,
            'Ocp-Apim-Subscription-Region': 'eastasia',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([{ Text: text }]),
        }
      );

      if (!response.ok) {
        console.error(await response.json());
        throw new Error(`Bing Translate API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        translatedText: data[0].translations[0].text as string,
        model: 'bing',
      };
    },
    {
      ttl: '15m',
    }
  );
}
