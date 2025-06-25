//model/promt.model.js
import mongoose from "mongoose";
const promtSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:"true"
        
    },
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export const Prompt = mongoose.model("Prompt", promtSchema);