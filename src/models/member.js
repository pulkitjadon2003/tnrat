import mongoose, { Schema } from "mongoose";

const memberSchema = new Schema({
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
    // alreadyMember: {
    //     type: Boolean,
    //     default: false,
    // },
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
    // faceVideo: {
    //     type: String,
    //     trim: true,
    //     default: "",
    // },
    // memberDocument: {
    //     type: String,
    //     trim: true,
    //     default: "",
    // },
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
        default: "pending",
    },
    memberShipStartDate: {
        type: Date,
        default: null
    },
    memberShipExpiry: {
        type: Date,
        default: null
    },
    yearlySubscriptionStart: {
        type: Date,
        default: null
    },
    yearlySubscriptionExpiry: {
        type: Date,
        default: null
    }
}, { timestamps: true });


// ✅ Safe model initialization (avoids recompilation errors)
const Member =
    mongoose.models?.Member || mongoose.model("Member", memberSchema);

export default Member;
