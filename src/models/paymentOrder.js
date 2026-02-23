import mongoose, { Schema } from "mongoose";

const paymentOrderSchema = new Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        default: null
    },
    orderId: {
        type: String,
        trim: true,
        default: "",
    },
    amount: {
        type: String,
        trim: true,
        default: "",
    },
    status: {
        type: String,
        trim: true,
        default: "processing",
    },
}, { timestamps: true });


// ✅ Safe model initialization (avoids recompilation errors)
const PaymentOrder =
    mongoose.models?.PaymentOrder || mongoose.model("PaymentOrder", paymentOrderSchema);

export default PaymentOrder;
