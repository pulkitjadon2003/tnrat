import mongoose, { Schema } from "mongoose";

const ipSchema = new Schema({
    ip: {
        type: String,
        trim: true,
        default: "",
    },
    description: {
        type: String,
        trim: true,
        default: "",
    }
}, { timestamps: true });


const IP = mongoose.models?.IP || mongoose.model("IP", ipSchema);

export default IP;
