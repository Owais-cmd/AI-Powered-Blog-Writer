import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});


// 1️⃣ Summarization
export const summary = async (req, res) => {
  try {
     const { title, content } = req.body;

    const text = `Title: ${title}\n\nContent: ${content}`;

    const prompt = `Summarize the following blog post in a concise way:\n\n${text}`;
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      }
    });
    return result.text ;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// 2️⃣ Paraphrasing
export const proofRead = async (req, res) => {
  try {
    const { content } = req.body;

    const prompt = `
    Proofread the following text but do NOT remove or change any markdown symbols 
    (such as #, *, **, _, \`, >, - , etc.). 
    Only fix grammar, spelling, and clarity inside the text while preserving all markdown formatting.

    Return ONLY the corrected markdown text:

    ${content}
    `;
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      }
    });

    res.json({ paraphrased: result.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// 3️⃣ SEO Keywords & Title Suggestions
export const seo = async (req, res) => {
  try {
    const { title, content } = req.body;

    const text = `Title: ${title}\n\nContent: ${content}`;

    const prompt = `From the following blog post, generate:
    1. 5 SEO keywords in a format of an array with no prefix text [ first keyword, second keyword, third keyword, fourth keyword, fifth keyword ]

    Blog post:\n\n${text}`;
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      }
    });

    return  result.text ;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};