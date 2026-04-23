import { analyzeBill } from "../services/analyzeBillService.js";
import { extractTextFromImage } from "../services/ocrService.js";

export const billController = async (req, res) => {
  try {
    // console.log("FILE:", req.file); 
    // console.log("PATH:", req.file?.path);
    // console.log("SIZE:", req.file?.size);
    // console.log("MIMETYPE:", req.file?.mimetype);

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false,
      });
    }
    // console.log("BODY:", req.body);

    const fileUrl = String(req.file.path); // Cloudinary URL
    // console.log("FINAL FILE URL:", fileUrl);

    // OCR
    const extractedText = await extractTextFromImage(
      req.file.path,
      req.file.mimetype,
    );
    // console.log("STEP 2: OCR DONE:", extractedText);

    // console.log("STEP 3: HF START");
    // AI
    const billData = await analyzeBill(extractedText);
    // console.log("STEP 4: HF DONE:", billData);

    return res.json({ extractedText, billData, file: req.file, success: true });
  } catch (error) {
    console.error("Error in bill controller:", error);
    return res.status(500).json({ error: "Internal server error", success: false });
  }
};