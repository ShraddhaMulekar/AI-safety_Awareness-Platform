import axios from "axios";

const HF_CHAT_URL = "https://router.huggingface.co/v1/chat/completions";
const MODEL_CANDIDATES = [
  process.env.HF_MODEL,
  "Qwen/Qwen2.5-7B-Instruct",
  "meta-llama/Llama-3.1-8B-Instruct",
  "mistralai/Mistral-7B-Instruct-v0.3",
].filter(Boolean);

const parseGeneratedJson = (generatedText) => {
  if (!generatedText) return null;
  const start = generatedText.indexOf("{");
  const end = generatedText.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    return JSON.parse(generatedText.slice(start, end + 1));
  } catch {
    return null;
  }
};

const extractChatText = (data) => data?.choices?.[0]?.message?.content || "";

const buildPrompt = (text) => `
Extract structured bill details from this OCR text.
Return STRICT JSON only:
{
  "total": "",
  "items": [],
  "summary": ""
}

OCR TEXT:
${text}
`;

const fallbackBillParser = (text) => {
  const amountMatches = [...text.matchAll(/(?:Rs\.?|INR|TOTAL|Total)?\s*[:=]?\s*(\d{2,6}(?:\.\d{1,2})?)/gi)]
    .map((m) => Number(m[1]))
    .filter((n) => Number.isFinite(n));

  const bestTotal = amountMatches.length ? Math.max(...amountMatches) : null;
  const compactSummary = text.replace(/\s+/g, " ").slice(0, 220);

  return {
    total: bestTotal ? String(bestTotal) : "",
    items: [],
    summary: compactSummary || "Bill text extracted successfully.",
    parser: "fallback",
  };
};

export const analyzeBill = async (text) => {
  try {
    if (!process.env.HF_API_KEY) {
      return fallbackBillParser(text);
    }

    let lastError = "No model attempts were made";

    for (const model of MODEL_CANDIDATES) {
      try {
        const response = await axios.post(
          HF_CHAT_URL,
          {
            model,
            messages: [
              {
                role: "system",
                content: "You extract bill data and must return only valid JSON.",
              },
              { role: "user", content: buildPrompt(text) },
            ],
            temperature: 0.1,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_API_KEY}`,
              "Content-Type": "application/json",
            },
          },
        );

        const generatedText = extractChatText(response.data);
        const parsed = parseGeneratedJson(generatedText);

        if (parsed) {
          return {
            ...parsed,
            parser: "hf-chat",
            modelUsed: model,
          };
        }

        if (generatedText) {
          return {
            total: "",
            items: [],
            summary: generatedText.slice(0, 500),
            parser: "hf-chat-raw-text",
            modelUsed: model,
          };
        }
      } catch (err) {
        lastError = JSON.stringify(err.response?.data || err.message);
      }
    }

    const fallback = fallbackBillParser(text);
    return {
      ...fallback,
      aiError: lastError,
    };
  } catch (error) {
    const hfError = error.response?.data || error.message;
    const fallback = fallbackBillParser(text);
    return {
      ...fallback,
      aiError: typeof hfError === "string" ? hfError : JSON.stringify(hfError),
    };
  }
};
