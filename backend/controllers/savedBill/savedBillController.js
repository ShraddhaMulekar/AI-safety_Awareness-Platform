import { SavedBillModel } from "../../models/SavedBillModel.js";

export const savedBillController = async (req, res) => {
    const { billData, extractedText } = req.body;

    try {
        // ✅ CHANGE: Check if this bill already saved before saving
        const existingBill = await SavedBillModel.findOne({
            userId: req.user._id,
            "billData.billNumber": billData.billNumber,
            "billData.accountNumber": billData.accountNumber,
        });

        // ✅ CHANGE: If found, don't save again
        if (existingBill) {
            return res.status(409).json({
                message: "This bill is already saved!",
                ok: false,
                duplicate: true,
            });
        }

        // No duplicate found — save normally
        const newBill = await SavedBillModel.create({
            userId: req.user._id,
            billData,
            extractedText,
        });

        res.status(201).json({ message: "Bill saved successfully", ok: true, bill: newBill });

    } catch (error) {
        console.error("Error saving bill:", error);
        res.status(500).json({ message: "Error saving bill", ok: false });
    }
};