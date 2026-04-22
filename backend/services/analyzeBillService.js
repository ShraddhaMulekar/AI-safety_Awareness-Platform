import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const HF_URL = "https://router.huggingface.co/v1/chat/completions";
const cleanText = (text = "") =>
  text
    .replace(/[^\S\r\n]+/g, " ")
    .replace(/[|]{2,}/g, " ")
    .replace(/[^\x20-\x7E\r\n]/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const detectBillType = (text) => {
  const t = text.toLowerCase();

  if (
    t.includes("महावितरण") ||
    t.includes("electricity") ||
    t.includes("kwh") ||
    t.includes("unit") ||
    t.includes("billing unit")
  ) {
    return "electricity";
  }

  if (
    t.includes("जल") ||
    t.includes("water") ||
    t.includes("litre") ||
    t.includes("kl")
  ) {
    return "water";
  }

  return "other";
};

const extractFirst = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return "";
};

const parseDate = (value = "") => {
  const match = value.match(/\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/);
  return match ? match[0].replace(/\./g, "-") : "";
};

const parseAmount = (value = "") => {
  const cleaned = value.replace(/[, ]/g, "");
  const match = cleaned.match(/\d{1,6}(?:\.\d{1,2})?/);
  return match ? Number.parseFloat(match[0]) : NaN;
};

const findElectricityTotal = (text) => {
  const patterns = [
    /देयक रक्कम\s*[:\-]?\s*₹?\s*([0-9,]+\.\d{2})/i,
    /bill amount\s*[:\-]?\s*₹?\s*([0-9,]+\.\d{2})/i,
    /total\s*amount\s*[:\-]?\s*₹?\s*([0-9,]+\.\d{2})/i,
  ];

  for (const p of patterns) {
    const m = text.match(p);
    if (m) return parseAmount(m[1]).toFixed(2);
  }

  return "";
};

const findLabeledTotal = (text) => {
  const labelPatterns = [
    /(?:total\s*amount|amount\s*due|net\s*amount|bill\s*amount|payable)\s*[:\-]?\s*(?:rs\.?|inr)?\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)/i,
    /(?:rs\.?|inr)\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)\s*(?:only)?\b/i,
  ];

  for (const pattern of labelPatterns) {
    const match = text.match(pattern);
    if (!match?.[1]) continue;
    const amount = parseAmount(match[1]);
    if (Number.isFinite(amount) && amount >= 10 && amount <= 200000) {
      return amount.toFixed(2);
    }
  }
  return "";
};

const findBestAmountFallback = (text) => {
  const rawMatches = [...text.matchAll(/\b\d{2,6}(?:\.\d{1,2})?\b/g)].map((m) =>
    parseAmount(m[0]),
  );
  const valid = rawMatches.filter(
    (n) => Number.isFinite(n) && n >= 10 && n <= 200000,
  );
  if (!valid.length) return "";
  valid.sort((a, b) => b - a);
  return valid[0].toFixed(2);
};

const extractUtilityUnit = (text, type) => {
  if (type === "electricity") {
    
    // ✅ Pattern 1: Mahadiscom table — currentReading prevReading multiplier UNITS samaUnit ekunVapar
    // e.g: "23663 23479 1.00 184 0 184"
    const tablePattern = text.match(
      /\b\d{4,6}\s+\d{4,6}\s+[\d.]+\s+(\d{1,4})\s+\d{1,4}\s+\d{1,4}\b/
    );
    if (tablePattern?.[1]) return tablePattern[1];

    // ✅ Pattern 2: number after multiplier "1.00"
    // e.g: "1.00  184"
    const multiplierPattern = text.match(/\b1\.00\s+(\d{1,4})\b/);
    if (multiplierPattern?.[1]) return multiplierPattern[1];

    // ✅ Pattern 3: Marathi label युनिट
    const marathiPattern = text.match(/युनिट\s*[:\-]?\s*(\d{1,4})/i);
    if (marathiPattern?.[1]) return marathiPattern[1];

    // ✅ Pattern 4: English label
    const englishPattern = text.match(
      /(?:units?\s*consumed|billing\s*units?|total\s*units?)\s*[:\-]?\s*(\d{1,4})/i
    );
    if (englishPattern?.[1]) return englishPattern[1];
  }

  if (type === "water") {
    const direct = extractFirst(text, [
      /(?:consumption|usage|water)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)\s*(kl|kilolitre|litre|ltr)/i,
      /\b([0-9]+(?:\.[0-9]+)?)\s*(kl|kilolitre|litre|ltr)\b/i,
    ]);
    if (direct) return direct.replace(/\s+/g, " ");
  }

  return "";
};

const normalizeItemName = (value = "") =>
  value
    .replace(/^[\d.\-\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();

const extractShoppingItems = (rawText) => {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const items = [];
  for (const line of lines) {
    const richPattern = line.match(
      /^(.+?)\s+(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d{1,2})?)\s+(\d+(?:\.\d{1,2})?)$/,
    );
    if (richPattern) {
      const [, rawName, qtyStr, unitPriceStr, lineTotalStr] = richPattern;
      const quantity = parseAmount(qtyStr);
      const unitPrice = parseAmount(unitPriceStr);
      const lineTotal = parseAmount(lineTotalStr);
      if (
        normalizeItemName(rawName) &&
        Number.isFinite(quantity) &&
        Number.isFinite(unitPrice) &&
        Number.isFinite(lineTotal)
      ) {
        items.push({
          name: normalizeItemName(rawName),
          quantity,
          unitPrice: unitPrice.toFixed(2),
          total: lineTotal.toFixed(2),
        });
      }
      continue;
    }

    const amountMatches = [...line.matchAll(/\b\d+(?:\.\d{1,2})?\b/g)].map(
      (m) => parseAmount(m[0]),
    );
    if (amountMatches.length >= 2) {
      const maybeQty = amountMatches[0];
      const maybeTotal = amountMatches[amountMatches.length - 1];
      const rawName = line.replace(/\b\d+(?:\.\d{1,2})?\b/g, " ").trim();
      if (
        normalizeItemName(rawName).length >= 2 &&
        Number.isFinite(maybeQty) &&
        Number.isFinite(maybeTotal) &&
        maybeQty > 0 &&
        maybeQty <= 100 &&
        maybeTotal >= 1 &&
        maybeTotal <= 200000
      ) {
        items.push({
          name: normalizeItemName(rawName),
          quantity: maybeQty,
          unitPrice: "",
          total: maybeTotal.toFixed(2),
        });
      }
    }
  }

  const deduped = [];
  const seen = new Set();
  for (const item of items) {
    const key = `${item.name}|${item.quantity}|${item.total}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(item);
    }
  }
  return deduped.slice(0, 30);
};

const validateShoppingBill = (items, total) => {
  const totalNumber = parseAmount(String(total || ""));
  const itemSum = items.reduce(
    (sum, item) => sum + (parseAmount(String(item.total)) || 0),
    0,
  );
  const roundedItemSum = Number.isFinite(itemSum) ? itemSum.toFixed(2) : "";

  if (!items.length) {
    return {
      itemCount: 0,
      calculatedTotal: roundedItemSum,
      totalsMatch: null,
      mismatchNote: "Could not reliably read item rows from this bill.",
    };
  }

  if (!Number.isFinite(totalNumber)) {
    return {
      itemCount: items.length,
      calculatedTotal: roundedItemSum,
      totalsMatch: null,
      mismatchNote:
        "Bill total was not read clearly enough to compare with item totals.",
    };
  }

  const difference = Math.abs(itemSum - totalNumber);
  const totalsMatch = difference <= 1;

  return {
    itemCount: items.length,
    calculatedTotal: roundedItemSum,
    totalsMatch,
    mismatchNote: totalsMatch
      ? "Item totals match the bill total."
      : `Mismatch found: item total is Rs ${roundedItemSum}, but bill total is Rs ${totalNumber.toFixed(2)}.`,
  };
};

const buildBullets = (data) => {
  const bullets = [];
  if (data.total) bullets.push(`Amount to pay: Rs ${data.total}`);
  if (data.unit) bullets.push(`Units consumed: ${data.unit}`);
  if (data.dueDate) bullets.push(`Due date: ${data.dueDate}`);
  if (data.billNumber) bullets.push(`Bill number: ${data.billNumber}`);
  if (data.accountNumber)
    bullets.push(`Account/consumer number: ${data.accountNumber}`);
  if (data.consumerName) bullets.push(`Consumer name: ${data.consumerName}`);
  if (typeof data.itemCount === "number" && data.itemCount > 0) {
    bullets.push(`Items found in bill: ${data.itemCount}`);
  }
  if (data.mismatchNote) bullets.push(data.mismatchNote);
  bullets.push("Pay before due date to avoid late fees.");
  return bullets.slice(0, 6);
};

const buildDeterministicExtraction = (rawText) => {
  const text = cleanText(rawText);
  const type = detectBillType(text);
  const dueDate = parseDate(
    extractFirst(text, [
      /देय दिनांक\s*[:\-]?\s*([0-9\/\-\.]+)/i,
      /due date\s*[:\-]?\s*([0-9\/\-\.]+)/i,
      /(?:due\s*date|pay\s*by)/i,
      /(?:due\s*date|pay\s*by)\s*[:\-]?\s*([^\n]+)/i,
      /\b(due[:\s\-]*\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/i,
    ]),
  );

  const billNumber = extractFirst(text, [
    /(?:bill\s*no(?:\.|umber)?(?:\s*\([^)]+\))?)\s*[:\-]?\s*([A-Z0-9\-\/]{6,})/i,
    /(?:invoice\s*no(?:\.|umber)?)\s*[:\-]?\s*([A-Z0-9\-\/]{6,})/i,
  ]);

  const accountNumber = extractFirst(text, [
    /(?:account|consumer|customer|service|ted)\s*(?:no|number|id)?\s*[:\-]?\s*([A-Z0-9\-]{8,})/i,
  ]);

  const consumerName = extractFirst(text, [
    /(?:name|consumer\s*name)\s*[:\-]?\s*([A-Z][A-Z\s]{3,40})/i,
  ]);

  const total =
    type === "electricity"
      ? findElectricityTotal(text)
      : findLabeledTotal(text) || findBestAmountFallback(text);

  const unit = extractUtilityUnit(text, type);
  const items = type === "other" ? extractShoppingItems(rawText) : [];
  const validation =
    type === "other" ? validateShoppingBill(items, total) : null;

  const summaryParts = [
    total ? `Total payable is Rs ${total}.` : "",
    unit ? `Usage recorded is ${unit}.` : "",
    dueDate ? `Due date is ${dueDate}.` : "",
    billNumber ? `Bill number is ${billNumber}.` : "",
    accountNumber ? `Consumer/account number is ${accountNumber}.` : "",
    validation?.mismatchNote ? validation.mismatchNote : "",
  ].filter(Boolean);

  const summary =
    summaryParts.join(" ") ||
    "Bill processed. Please verify key values manually because OCR quality is low.";

  const result = {
    type,
    category:
      type === "electricity"
        ? "Electricity Bill"
        : type === "water"
          ? "Water Bill"
          : "Other Bill",
    total,
    unit,
    dueDate,
    consumerName,
    consumerAddress: "",
    billNumber,
    accountNumber,
    lastPayment: { amount: "", unit: "" },
    items,
    itemCount: validation?.itemCount || items.length,
    calculatedTotal: validation?.calculatedTotal || "",
    totalsMatch: validation?.totalsMatch ?? null,
    mismatchNote: validation?.mismatchNote || "",
    summary,
    parser: "deterministic",
  };

  result.bullets = buildBullets(result);
  return result;
};

const buildPrompt = (data, text) => `
You are cleaning bill data extracted by OCR.
Return STRICT JSON only with this shape:
{
  "total": "",
  "unit": "",
  "dueDate": "",
  "consumerName": "",
  "billNumber": "",
  "accountNumber": "",
  "items": [],
  "itemCount": 0,
  "calculatedTotal": "",
  "totalsMatch": null,
  "mismatchNote": "",
  "summary": "",
  "bullets": []
}

Rules:
- Keep values realistic from OCR text.
- Do not invent missing values.
- Keep summary in 1-2 short sentences.
- Keep bullets maximum 5.

Current extracted data:
${JSON.stringify(data)}

OCR text:
${text.slice(0, 5000)}
`;

const extractJSON = (text = "") => {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
};

const mergeAIOverDeterministic = (base, ai) => {
  if (!ai || typeof ai !== "object") return base;
  const merged = { ...base };
  const total = parseAmount(String(ai.total || ""));
  if (Number.isFinite(total) && total >= 10 && total <= 200000)
    merged.total = total.toFixed(2);
  if (ai.unit) merged.unit = String(ai.unit).slice(0, 30).trim();
  const dueDate = parseDate(String(ai.dueDate || ""));
  if (dueDate) merged.dueDate = dueDate;
  if (ai.consumerName)
    merged.consumerName = String(ai.consumerName).slice(0, 80).trim();
  if (ai.billNumber)
    merged.billNumber = String(ai.billNumber).slice(0, 40).trim();
  if (ai.accountNumber)
    merged.accountNumber = String(ai.accountNumber).slice(0, 40).trim();
  if (Array.isArray(ai.items) && ai.items.length && merged.type === "other") {
    merged.items = ai.items
      .map((item) => ({
        name: normalizeItemName(String(item?.name || "")),
        quantity: parseAmount(String(item?.quantity || "")) || 0,
        unitPrice: Number.isFinite(parseAmount(String(item?.unitPrice || "")))
          ? parseAmount(String(item.unitPrice)).toFixed(2)
          : "",
        total: Number.isFinite(parseAmount(String(item?.total || "")))
          ? parseAmount(String(item.total)).toFixed(2)
          : "",
      }))
      .filter((item) => item.name && item.quantity >= 0 && item.total);
    const validation = validateShoppingBill(merged.items, merged.total);
    merged.itemCount = validation.itemCount;
    merged.calculatedTotal = validation.calculatedTotal;
    merged.totalsMatch = validation.totalsMatch;
    merged.mismatchNote = validation.mismatchNote;
  }
  if (ai.summary)
    merged.summary = String(ai.summary)
      .replace(/\s+/g, " ")
      .slice(0, 220)
      .trim();
  if (Array.isArray(ai.bullets) && ai.bullets.length) {
    merged.bullets = ai.bullets
      .map((b) => String(b).trim())
      .filter(Boolean)
      .slice(0, 6);
  } else {
    merged.bullets = buildBullets(merged);
  }
  merged.parser = "deterministic+ai";
  return merged;
};

export const analyzeBill = async (text) => {
  const deterministic = buildDeterministicExtraction(text);
  try {
    if (!process.env.HF_API_KEY) {
      return deterministic;
    }

    const response = await axios.post(
      HF_URL,
      {
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: [
          {
            role: "system",
            content: "Return only valid JSON. Do not include markdown.",
          },
          {
            role: "user",
            content: buildPrompt(deterministic, cleanText(text)),
          },
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

    const output = response.data?.choices?.[0]?.message?.content;
    const parsed = extractJSON(output);
    return mergeAIOverDeterministic(deterministic, parsed);
  } catch (error) {
    console.error("AI Error:", error.message);
    return deterministic;
  }
};
