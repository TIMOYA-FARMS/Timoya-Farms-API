import { model, Schema } from "mongoose";

const batchSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  productionDate: { type: Date, default: Date.now },
  parboilingCycle: { type: String }, // or enum if cycles are predefined
  warehouse: { type: String }, // or ref to a Warehouse model
  notes: { type: String }
}, { timestamps: true });

export const BatchModel = model('Batch', batchSchema);
