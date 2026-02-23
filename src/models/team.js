import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: "",
    },
    leader: {
        type: String,
        trim: true,
        default: "",
    },
    logo: {
        type: String,
        trim: true,
        default: "",
    },
    members: {
        type: [{
            name: String,
            email: String,
            phone: String
        }],
        default: [],
    }
}, { timestamps: true });


const Team = mongoose.models?.Team || mongoose.model("Team", teamSchema);

export default Team;
