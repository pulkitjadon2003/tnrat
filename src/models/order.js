import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    orderId: {
        type: String,
        trim: true,
        default: "",
    },
    memberId: {
        type: String,
        trim: true,
        default: "",
    },
    fullName: {
        type: String,
        trim: true,
        default: "",
    },
    email: {
        type: String,
        trim: true,
        default: "",
    },
    phone: {
        type: String,
        trim: true,
        default: "",
    },
    password: {
        type: String,
        trim: true,
        default: "",
    },
    address: {
        type: String,
        trim: true,
        default: "",
    },
    isMember: {
        type: Boolean,
        default: true,
    },
    alreadyMember: {
        type: Boolean,
        default: false,
    },
    joinReason: {
        type: String,
        trim: true,
        default: "",
    },
    documentType: {
        type: String,
        trim: true,
        default: "",
    },
    documentNumber: {
        type: String,
        trim: true,
        default: "",
    },
    document: {
        type: String,
        trim: true,
        default: "",
    },
    documentVerified: {
        type: Boolean,
        default: false,
    },
    facePicture: {
        type: String,
        trim: true,
        default: "",
    },
    faceVideo: {
        type: String,
        trim: true,
        default: "",
    },
    memberDocument: {
        type: String,
        trim: true,
        default: "",
    },
    transactions: [{
        transactionId: {
            type: String,
            trim: true,
            default: "",
        },
        amount: {
            type: String,
            trim: true,
            default: "",
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        date: {
            type: Date,
            default: Date.now()
        }
    }],
    status: {
        type: String,
        trim: true,
        default: "processing",
    },
}, { timestamps: true });


// ✅ Safe model initialization (avoids recompilation errors)
const Order =
    mongoose.models?.Order || mongoose.model("Order", orderSchema);

export default Order;
