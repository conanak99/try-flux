import { config } from "@/config";
import Groq from "groq-sdk";

const API_KEYS = config.groqApiKeys;
const MODELS = [
  "gemma2-9b-it",
  // "gemma-7b-it",
  "llama3-8b-8192",
  "llama-3.1-70b-versatile",
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
) => `You are a highly skilled translator. Your task is to translate the following text into English as a prompt:
<text_to_translate>
${input}
</text_to_translate>

Please follow these guidelines:
1. The input can be Vietnamese or English. If the input is in English, just output the original text, word for word.
2. Translate the text accurately, preserving the original meaning and tone.
3. Ensure that the translation reads naturally in English.
4. Maintain any formatting or structure present in the original text.
5. If there are any culturally specific terms or idioms, translate them into appropriate English equivalents.
6. Do not add any explanations, notes, or comments about the translation process.

Your output should contain only the translated text, with no additional commentary.`;

export const translateText = async (text: string) => {
  const groq = new Groq({ apiKey: getKey() });
  try {
    const result = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: getPrompt(text),
        },
      ],
      model: getModel(),
    });

    return result.choices[0].message.content?.trim();
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
