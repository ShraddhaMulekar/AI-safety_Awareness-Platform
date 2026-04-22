import Tesseract from "tesseract.js";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractTextFromImage = async (fileUrl, mimetype) => {
  try {
    if (mimetype === "application/pdf") {
      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer",
        maxRedirects: 5,
      });

      const buffer = new Uint8Array(response.data);

      // Load PDF
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdfDoc = await loadingTask.promise;

      let fullText = "";

      // Extract text from every page
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      if (!fullText.trim() || fullText.trim().length < 10) {
        throw new Error("PDF parsed but no text found — may be a scanned/image PDF");
      }

      return fullText;
    }

    // For images
    const result = await Tesseract.recognize(fileUrl, "eng+mar");
    return result.data.text;

  } catch (error) {
    console.error("OCR Error:", error.message);
    throw error;
  }
};