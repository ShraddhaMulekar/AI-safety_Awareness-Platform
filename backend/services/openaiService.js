import OpenAI from "openai";

const prompt = `
Analyze the following message and detect if it is a scam.

Message: "${text}"

Return JSON:
{
  "risk": "Low | Medium | High",
  "reason": "short explanation"
}
`;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeScam = async (text) => {
  const response = await client.chat.completions.create({
    model: "gpt-5.4",
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