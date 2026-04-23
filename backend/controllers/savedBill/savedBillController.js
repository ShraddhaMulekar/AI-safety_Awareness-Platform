import { SavedBillModel } from "../../models/SavedBillModel.js";

export const savedBillController = async (req, res) => {
  const { billData, extractedText } = req.body;

  try {
    // Check if this bill already saved before saving
    const existingBill = await SavedBillModel.findOne({
      userId: req.user._id,
      "billData.billNumber": billData.billNumber,
      "billData.accountNumber": billData.accountNumber,
    });

    // If found, don't save again
    if (existingBill) {
      return res.status(409).json({
        message: "This bill is already saved!",
        success: false,
        duplicate: true,
      });
    }

    // No duplicate found — save normally
    const newBill = await SavedBillModel.create({
      userId: req.user._id,
      billData,
      extractedText,
    });

    return res
      .status(201)
      .json({
        message: "Bill saved successfully!",
        success: true,
        bill: newBill,
      });
  } catch (error) {
    console.error("Error saving bill:", error);
    return res
      .status(500)
      .json({ message: "Error saving bill", success: false });
  }
};