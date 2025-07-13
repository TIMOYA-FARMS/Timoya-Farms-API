import { Schema, model, Types } from "mongoose";

const gallerySchema = new Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  title: { type: String },
  category: {
    type: Types.ObjectId,
    ref: 'Category',
    required: false
  },
  uploadedBy: { type: Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export const Gallery = model("Gallery", gallerySchema); 