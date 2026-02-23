import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    team: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        default: null,
    },
    title: {
        type: String,
        trim: true,
        default: "",
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    caseDate: {
        type: Date,
        default: null
    },
    state: {
        type: String,
        trim: true,
        default: "",
    },
    city: {
        type: String,
        trim: true,
        default: "",
    },
    images: {
        type: [String],
        default: [],
    },
    video: {
        type: String,
        trim: true,
        default: "",
    },
}, { timestamps: true });


const Post = mongoose.models?.Post || mongoose.model("Post", postSchema);

export default Post;
