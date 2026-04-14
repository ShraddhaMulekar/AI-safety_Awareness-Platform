import OpenAI from "openai";

export const analyzeScam = async (text) => {
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const prompt = `
You are an AI system trained to detect scams in messages.

Analyze the message below and determine if it is a scam or not.

Message:
"${text}"

Instructions:
- Carefully check for scam patterns such as:
  • Requests for money or personal information
  • Urgency or pressure (e.g., "act now", "limited time")
  • Too-good-to-be-true offers (lottery, prizes, free money)
  • Suspicious links or unknown sources
  • Impersonation (bank, government, company)

- Based on your analysis, classify the risk level:
  • Low → Likely safe
  • Medium → Suspicious
  • High → Very likely a scam

- Respond ONLY in valid JSON format (no extra text).

Output format:
{
  "risk": "Low | Medium | High",
  "reason": "Clear and short explanation in 1 sentence"
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
  const cleanResponse = response.choices[0].message.content
    .replace(/```json|```/g, "")
    .trim();
  const parsed = JSON.parse(cleanResponse);
  return parsed;
};
