
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This should be set in your environment variables
});

// Example: Chat completion
async function chatWithOpenAI() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello! How are you?" }
      ],
      model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error calling OpenAI:', error);
  }
}

// Example: Text generation
async function generateText(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 150,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}

// Example usage
chatWithOpenAI();

// You can also export functions for use in other files
export { generateText, chatWithOpenAI };
