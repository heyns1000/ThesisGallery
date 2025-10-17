
import type { Express } from "express";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function registerOpenAIRoutes(app: Express) {
  app.post("/api/openai/chat", async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message }
        ],
        model: "gpt-3.5-turbo",
        max_tokens: 500,
      });

      res.json({
        response: completion.choices[0].message.content
      });
    } catch (error) {
      console.error('OpenAI API error:', error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });
}
