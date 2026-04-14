import axios from "axios";

export const analyzeBill = async (text) => {
  const response = await axios.post(
    "https://api-inference.huggingface.co/models/google/flan-t5-base",
    {
      inputs: `
Extract structured bill details from this text:

${text}

Return JSON:
{
  "total": "",
  "items": [],
  "summary": ""
}
`,
    },
    {
      headers: {
        Authorization: "Bearer YOUR_HF_API_KEY",
      },
    },
  );

  return response.data;
};
