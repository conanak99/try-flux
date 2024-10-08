import Groq from 'groq-sdk';

import { bento } from '@/app/services/cache';
import { config } from '@/config';

const API_KEYS = config.groqApiKeys;
const MODELS = [
  'gemma2-9b-it',
  // "gemma-7b-it",
  'llama3-8b-8192',
  'llama-3.1-70b-versatile',
];

const getKey = () => {
  // Get random key
  const randomIndex = Math.floor(Math.random() * API_KEYS.length);
  return API_KEYS[randomIndex];
};

const getModel = () => {
  return MODELS[Math.floor(Math.random() * MODELS.length)];
};

const getPrompt = (
  input: string
) => `You are a highly skilled Vietnamese-English translator.

Follow these guidelines:
1. The text input can be Vietnamese or English. If the input is in English, just output the original text word for word.
2. Translate the text accurately, preserving the original meaning and tone.
3. Maintain any formatting or structure present in the original text.
5. Your output should contain ONLY the translated text, with NO additional commentary or note.

Your task is to translate the following text into English:
\`\`\`
${input}
\`\`\`
`;

export const _translate = async (text: string) => {
  const apiKey = getKey();
  const model = getModel();

  const groq = new Groq({ apiKey });

  try {
    const result = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: getPrompt(text),
        },
      ],
      model,
    });

    const translatedText =
      result.choices[0].message.content
        ?.replaceAll('Here is the translation', '')
        ?.replaceAll('here is the translation', '')
        ?.replaceAll('`', '')
        ?.trim() ?? text;

    return { translatedText, model };
  } catch (error) {
    // console.error(error, apiKey);
    throw error;
  }
};

export const translate = async (text: string) => {
  const key = `translate:${text.toLowerCase().trim()}`;

  return bento.getOrSet(key, async () => await _translate(text), {
    ttl: '10m', // Cache translated text for 10 minutes
  });
};
