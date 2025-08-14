// server/models/events.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please check the entry, no title specified."],
      trim: true,
    },
    img: {
      type: String,
      default: "test.jpg", // filename in client/public/images
    },
    location: { type: String, required: true, trim: true },
    price: { type: Number, min: 0, required: true },
    rating: { type: Number, min: 1, max: 5, default: 3 },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
