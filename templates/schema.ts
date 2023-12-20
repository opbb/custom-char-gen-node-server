import mongoose from "mongoose";
const templateTraitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ["text", "longText", "number"] },
  randomOptionsID: String,
});
const templateSchema = new mongoose.Schema(
  {
    ownerID: { type: String, required: true },
    title: String,
    visibility: { type: String, required: true, enum: ["public", "private"] },
    description: String,
    traits: [templateTraitSchema],
  },
  { collection: "templates" }
);
export default templateSchema;
