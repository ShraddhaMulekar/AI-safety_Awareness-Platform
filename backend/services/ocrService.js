import Tesseract from "tesseract.js";
import { fromPath } from "pdf2pic";

export const extractTextFromImage = async (filePath, mimetype) => {
  try {
    // ✅ If PDF → convert first page to image
    if (mimetype === "application/pdf") {
      const convert = fromPath(filePath, {
        density: 200,
        saveFilename: "temp",
        savePath: "./uploads",
        format: "png",
        width: 1024,
        height: 1024,
      });

      const page = await convert(1); // first page only
      const imagePath = page.path;

      // OCR on converted image
      const result = await Tesseract.recognize(imagePath, "eng+mar", {
        tessedit_char_whitelist:
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:/-.₹Rs ",
      });

      return result.data.text;
    }

    // ✅ Normal image
    const result = await Tesseract.recognize(filePath, "eng+mar", {
      tessedit_char_whitelist:
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:/-.₹Rs ",
    });

    return result.data.text;
  } catch (error) {
    console.error("OCR Error:", error);
    throw error;
  }
};