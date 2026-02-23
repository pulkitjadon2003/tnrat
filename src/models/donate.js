import mongoose, { Schema } from "mongoose";

const donateSchema = new Schema({
    orderId: {
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
    amount: {
        type: String,
        default: "",
    },
    transactionId: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        default: "",
    },
    donateAnonymously: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const Donate = mongoose.models?.Donate || mongoose.model("Donate", donateSchema);

export default Donate;