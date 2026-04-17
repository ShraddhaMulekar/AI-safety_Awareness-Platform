import { SavedBillModel } from "../../models/SavedBillModel.js";

export const getSavedBillsController = async (req, res) => {
    try {
        const savedBills = await SavedBillModel.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ message: "Saved bills fetched successfully", ok: true, bills: savedBills });

    } catch (error) {
        console.error("Error fetching saved bills:", error);
        res.status(500).json({ message: "Error fetching saved bills", ok: false });
    }
}