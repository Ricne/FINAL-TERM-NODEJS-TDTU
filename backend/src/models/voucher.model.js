import mongoose from 'mongoose';
import { type } from 'os';

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true },
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, required: true },
  minOrderAmount: {type: Number, require: true},
  createdAt: { type: Date, default: Date.now },
});

export const VoucherModel = mongoose.model('VoucherModel', voucherSchema);
