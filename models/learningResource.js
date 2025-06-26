import { Schema, model } from "mongoose";

const learningResourceSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["manual", "video", "article", "quiz"], required: true },
    url: { type: String }, // For videos, PDFs, or external links
    file: { type: String }, // For uploaded files
    topics: [{ type: String }],
    language: { type: String, default: "en" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: false }
});

export const LearningResource = model("LearningResource", learningResourceSchema);
