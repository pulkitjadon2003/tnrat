import mongoose, { Schema } from "mongoose";

const globalSchema = new Schema({
    whitelistEnabled: {
        type: Boolean,
        default: false
    },
    sessionTimeout: {
        type: Number,
        default: 0
    },
    memberEntryFee: {
        type: Number,
        default: 0
    },
    memberSubscriptionFee: {
        type: Number,
        default: 0
    },
    instagram: {
        type: String,
        default: ""
    },
    facebook: {
        type: String,
        default: ""
    },
    twitter: {
        type: String,
        default: ""
    },
    announcements: [{
        type: String,
        default: ""
    }]
}, { timestamps: true });


const Global = mongoose.models?.Global || mongoose.model("Global", globalSchema);

export default Global;
