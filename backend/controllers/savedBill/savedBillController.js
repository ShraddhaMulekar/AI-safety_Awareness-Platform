import { SavedBillModel } from "../../models/SavedBillModel.js";

export const savedBillController = async (req, res) => {
    const {billData, extractedText} = req.body;

    try {
        const newBill = await SavedBillModel.create({
            userId: req.user._id,
            billData,
            extractedText
        });
        res.status(201).json({ message: "Bill saved successfully", ok: true, bill: newBill });
    } catch (error) {
        console.error("Error saving bill:", error);
        res.status(500).json({ message: "Error saving bill", ok: false });
    }
}