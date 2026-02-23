import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
    phone: {
        type: String,
        trim: true,
        default: "",
    },
    otp: {
        type: String,
        trim: true,
        default: "",
    },
    otpExpiry: {
        type: Date,
        default: null
    }
}, { timestamps: true });


const Otp = mongoose.models?.Otp || mongoose.model("Otp", otpSchema);

export default Otp;
