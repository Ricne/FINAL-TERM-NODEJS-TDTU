import { model, Schema } from 'mongoose';
import mongoose from 'mongoose';

export const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    tags: { type: [String] },
    favorite: { type: Boolean, default: false },
    stars: { type: Number, default: 0 },
    imageUrls: { type: [String], required: true },
    origins: { type: [String], required: true },
    description: { type: String, required: true },
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, required: true, min: 0, max: 5 }, 
      },
    ],

    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

export const ProductModel = model('product', ProductSchema);
