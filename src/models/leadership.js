import mongoose, { Schema } from "mongoose";

const leadershipSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: "",
    },
    profile: {
        type: String,
        trim: true,
        default: "",
    },
    designation: {
        type: String,
        trim: true,
        default: "",
    }
}, { timestamps: true });


const LeaderShip = mongoose.models?.LeaderShip || mongoose.model("LeaderShip", leadershipSchema);

export default LeaderShip;
