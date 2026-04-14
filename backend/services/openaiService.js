import OpenAI from "openai";

export const analyzeScam = async (text) => {
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const prompt = `
Analyze the following message and detect if it is a scam.

Message: "${text}"

Return JSON:
{
  "risk": "Low | Medium | High",
  "reason": "short explanation"
}
`;

  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that detects scams in messages.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  return response.choices[0].message.content;
};