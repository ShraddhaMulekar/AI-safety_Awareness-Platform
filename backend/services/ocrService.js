// import Tesseract from "tesseract.js";
// import axios from "axios";
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// export const extractTextFromImage = async (fileUrl, mimetype) => {
//   try {
//     if (mimetype === "application/pdf") {
//       const response = await axios.get(fileUrl, {
//         responseType: "arraybuffer",
//         maxRedirects: 5,
//       });

//       const buffer = new Uint8Array(response.data);

//       // Load PDF
//       const loadingTask = pdfjsLib.getDocument({ data: buffer });
//       const pdfDoc = await loadingTask.promise;

//       let fullText = "";

//       // Extract text from every page
//       for (let i = 1; i <= pdfDoc.numPages; i++) {
//         const page = await pdfDoc.getPage(i);
//         const content = await page.getTextContent();
//         const pageText = content.items.map((item) => item.str).join(" ");
//         fullText += pageText + "\n";
//       }

//       if (!fullText.trim() || fullText.trim().length < 10) {
//         throw new Error("PDF parsed but no text found — may be a scanned/image PDF");
//       }

//       return fullText;
//     }

//     // For images
//     const result = await Tesseract.recognize(fileUrl, "eng+mar");
//     return result.data.text;

//   } catch (error) {
//     console.error("OCR Error:", error.message);
//     throw error;
//   }
// };

import Tesseract from "tesseract.js";
import axios from "axios";
import sharp from "sharp";

export const extractTextFromImage = async (fileUrl, mimetype) => {
  try {
    if (mimetype === "application/pdf") {
      const { createRequire } = await import("module");
      const require = createRequire(import.meta.url);
      const pdfParseModule = require("pdf-parse");
      const pdfParse = pdfParseModule.default || pdfParseModule;

      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer",
        maxRedirects: 5,
      });

      const buffer = Buffer.from(response.data);
      const magic = buffer.slice(0, 4).toString("ascii");
      if (!magic.startsWith("%PDF")) throw new Error("Not a valid PDF");

      const data = await pdfParse(buffer);
      if (!data.text || data.text.trim().length < 10)
        throw new Error("No text found in PDF");

      return data.text;
    }

    // ✅ For images — download and preprocess before OCR
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    // ✅ Preprocess: grayscale + increase contrast + sharpen
    // This massively improves OCR accuracy on phone-captured bills
    const processedBuffer = await sharp(Buffer.from(response.data))
      .grayscale()                          // remove color noise
      .normalise()                          // auto contrast
      .sharpen()                            // sharpen text edges
      .resize({ width: 2000, withoutEnlargement: false }) // upscale small images
      .toBuffer();

    // ✅ Run OCR on processed buffer directly
    const result = await Tesseract.recognize(processedBuffer, "eng+mar", {
      tessedit_pageseg_mode: "1",   // automatic page segmentation
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