import mongoose from "mongoose";
const characterTraitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ["text", "longText", "number"] },
  value: String,
});
const characterSchema = new mongoose.Schema(
  {
    ownerID: { type: String, required: true },
    visibility: { type: String, required: true, enum: ["public", "private"] },
    traits: [characterTraitSchema],
  },
  { collection: "characters" }
);
export default characterSchema;
