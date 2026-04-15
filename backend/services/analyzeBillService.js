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
  "summary": "",
  "bullets": []
}

OCR TEXT:
${text}
`;

const cleanLine = (value = "") => value.replace(/\s+/g, " ").trim();

const pickFirst = (text, regex) => {
  const match = text.match(regex);
  return match?.[1] ? cleanLine(match[1]) : "";
};

const buildEasyBullets = (text, total = "") => {
  const billNumber = pickFirst(text, /BILL\s*NO\.?\s*\(?[A-Z]*\)?\s*[:\-]?\s*([A-Z0-9\-\/]+)/i);
  const consumerNumber = pickFirst(text, /(?:CONSUMER|CUSTOMER|ACCOUNT|TED)\s*(?:NO|NUMBER)?\s*[:\-]?\s*([A-Z0-9\-]{6,})/i);
  const dueDate = pickFirst(text, /(?:DUE\s*DATE|PAY\s*BY)\s*[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{2,4})/i);
  const totalNumber = Number.parseFloat(String(total).replace(/[^\d.]/g, ""));
  const payableFromText = pickFirst(text, /(?:PAYABLE|TOTAL|BILL\s*AMOUNT|Rs\.?)\s*[:\-]?\s*(\d+(?:\.\d{1,2})?)/i);
  const payable = Number.isFinite(totalNumber) && totalNumber >= 10 ? total : payableFromText;

  const bullets = [];
  if (payable) bullets.push(`Amount to pay: Rs ${payable}`);
  if (dueDate) bullets.push(`Due date: ${dueDate}`);
  if (billNumber) bullets.push(`Bill number: ${billNumber}`);
  if (consumerNumber) bullets.push(`Consumer/account number: ${consumerNumber}`);
  bullets.push("Pay before due date to avoid late charges.");
  bullets.push("Keep this bill number for support or payment queries.");
  return bullets.slice(0, 6);
};

const normalizeBillData = (raw, text) => {
  const total = cleanLine(raw?.total || "");
  const summary = cleanLine(raw?.summary || "");
  const parsedBullets = Array.isArray(raw?.bullets)
    ? raw.bullets.map((b) => cleanLine(String(b))).filter(Boolean)
    : [];

  const bullets = parsedBullets.length
    ? parsedBullets.slice(0, 6)
    : buildEasyBullets(text, total);

  const shortSummary = summary
    ? summary.slice(0, 220)
    : "This is your electricity bill summary in simple points.";

  return {
    total,
    items: Array.isArray(raw?.items) ? raw.items : [],
    summary: shortSummary,
    bullets,
  };
};

const fallbackBillParser = (text) => {
  const amountMatches = [...text.matchAll(/(?:Rs\.?|INR|TOTAL|Total)?\s*[:=]?\s*(\d{2,6}(?:\.\d{1,2})?)/gi)]
    .map((m) => Number(m[1]))
    .filter((n) => Number.isFinite(n));

  const bestTotal = amountMatches.length ? Math.max(...amountMatches) : null;
  const compactSummary = text.replace(/\s+/g, " ").slice(0, 220);

  return normalizeBillData({
    total: bestTotal ? String(bestTotal) : "",
    items: [],
    summary: compactSummary || "Bill text extracted successfully.",
  }, text);
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
            ...normalizeBillData(parsed, text),
            parser: "hf-chat",
            modelUsed: model,
          };
        }

        if (generatedText) {
          return {
            ...normalizeBillData({ summary: generatedText }, text),
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