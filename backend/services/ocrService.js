import Tesseract from "tesseract.js";
import axios from "axios";
import sharp from "sharp";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractTextFromImage = async (fileUrl, mimetype) => {
  try {

    // ✅ PDF — use pdfjs-dist (works for electricity bill)
    if (mimetype === "application/pdf") {
      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer",
        maxRedirects: 5,
      });

      const buffer = new Uint8Array(response.data);
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdfDoc = await loadingTask.promise;

      let fullText = "";
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      if (!fullText.trim() || fullText.trim().length < 10) {
        throw new Error("PDF parsed but no text found");
      }

      return fullText;
    }

    // ✅ IMAGE — download + preprocess + Tesseract (works for water bill photo)
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    const processedBuffer = await sharp(Buffer.from(response.data))
      .grayscale()                                        // remove color noise
      .normalise()                                        // auto contrast
      .sharpen()                                          // sharpen text edges
      .resize({ width: 2000, withoutEnlargement: false }) // upscale small images
      .toBuffer();

    const result = await Tesseract.recognize(processedBuffer, "eng+mar", {
      tessedit_pageseg_mode: "1",
    });

    console.log("=== RAW OCR OUTPUT ===");
    console.log(result.data.text);
    console.log("=== END OCR ===");

    return result.data.text;

  } catch (error) {
    console.error("OCR Error:", error.message);
    throw error;
  }
};