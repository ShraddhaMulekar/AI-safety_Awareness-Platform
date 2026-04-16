import axios from "axios";

const HF_URL = "https://router.huggingface.co/v1/chat/completions";

// STEP 1: Detect Bill Type
const detectBillType = (text) => {
  const t = text.toLowerCase();

  if (t.includes("electricity") || t.includes("kwh") || t.includes("units")) {
    return "electricity";
  }

  if (t.includes("water") || t.includes("litre") || t.includes("kl")) {
    return "water";
  }

  return "other";
};  

// STEP 2: Create Prompt
const buildPrompt = (text) => `
Analyze this bill and return JSON.

Types:
- electricity
- water
- other

IF electricity/water:
{
  "type": "",
  "total": "",
  "unit": "",
  "dueDate": "",
  "consumerName": "",
  "consumerAddress": "",
  "billNumber": "",
  "accountNumber": "",
  "lastPayment": {
    "amount": "",
    "unit": ""
  },
  "summary": ""
}

IF other:
{
  "type": "",
  "total": "",
  "items": [],
  "itemCount": "",
  "consumerName": "",
  "summary": ""
}

TEXT:
${text}
`;

// STEP 3: Extract JSON safely
const extractJSON = (text) => {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) return null;

    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
};

// STEP 4: Simple fallback (if AI fails)
const fallback = (text) => {
  const type = detectBillType(text);

  const amountMatch = text.match(/\d+(?:\.\d{1,2})?/g);
  const total = amountMatch ? Math.max(...amountMatch.map(Number)) : "";

  return {
    type,
    total: String(total),
    items: [],
    summary: "Basic extracted bill info",
  };
};

// STEP 5: Clean final response
const formatResponse = (data, text) => {
  const type = data?.type || detectBillType(text);

  // Utility Bill
  if (type === "electricity" || type === "water") {
    return {
      type,
      total: data?.total || "",
      unit: data?.unit || "",
      dueDate: data?.dueDate || "",
      consumerName: data?.consumerName || "",
      consumerAddress: data?.consumerAddress || "",
      billNumber: data?.billNumber || "",
      accountNumber: data?.accountNumber || "",
      lastPayment: {
        amount: data?.lastPayment?.amount || "",
        unit: data?.lastPayment?.unit || "",
      },
      summary: data?.summary || "Utility bill",
    };
  }

  // other Bill
  return {
    type: "other",
    total: data?.total || "",
    consumerName: data?.consumerName || "",
    itemCount: data?.itemCount || data?.items?.length || 0,
    items: data?.items || [],
    summary: data?.summary || "Shopping bill",
  };
};

// MAIN FUNCTION
export const analyzeBill = async (text) => {
  try {
    // If no API → fallback
    if (!process.env.HF_API_KEY) {
      return fallback(text);
    }

    const response = await axios.post(
      HF_URL,
      {
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: [
          {
            role: "system",
            content: "Return only valid JSON",
          },
          {
            role: "user",
            content: buildPrompt(text),
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    const output = response.data?.choices?.[0]?.message?.content;

    const parsed = extractJSON(output);

    if (!parsed) {
      return fallback(text);
    }

    return formatResponse(parsed, text);

  } catch (error) {
    console.error("AI Error:", error.message);
    return fallback(text);
  }
};