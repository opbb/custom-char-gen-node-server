import mongoose from "mongoose";
const randomOptionsSchema = new mongoose.Schema(
  {
    ownerID: { type: String, required: true },
    title: String,
    visibility: { type: String, required: true, enum: ["public", "private"] },
    description: String,
    type: { type: String, required: true, enum: ["list", "range"] },
    optionsList: [String],
    start: Number,
    end: Number,
    step: Number,
  },
  { collection: "randomOptions" }
);
export default randomOptionsSchema;
