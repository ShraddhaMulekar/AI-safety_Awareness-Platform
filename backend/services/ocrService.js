import Tesseract from "tesseract.js";

export const extractTextFromImage = async (imagePath) => {
    try {
        const result = await Tesseract.recognize(imagePath, "eng")
        return result.data.text;
    } catch (error) {
        console.error("Error during OCR processing:", error);
        throw error;
    }
}