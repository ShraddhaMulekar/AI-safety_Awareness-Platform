import mongoose from "mongoose";

const SavedBillSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    billData: {
        type: Object,
        required: true
    },
    extractedText: {
        type: String,
        required: true
    },
    createdAt: {   
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
})

export const SavedBillModel = mongoose.model("SavedBill", SavedBillSchema);