import { analyzeScam } from "../services/openaiService.js";

export const scamController = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ message: "Text is required", success: false });
    }

    const result = await analyzeScam(text);

    return res.status(200).json({
      message: "Scam analysis result",
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};