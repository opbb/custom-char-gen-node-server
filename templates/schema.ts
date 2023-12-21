import mongoose from "mongoose";
import { Visibility } from "../sharedTypes";

export type TemplateTrait {
  
}
export type Template = {
  ownerID: { type: String, required: true },
  title: String,
  visibility: {
    type: String,
    required: true,
    enum: ["PUBLIC", "FRIENDS_ONLY", "PRIVATE"],
  },
  description: String,
  traits: [templateTraitSchema],
};

const templateTraitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ["text", "longText", "number"] },
  randomOptionsID: String,
});
const templateSchema = new mongoose.Schema(
  {
    ownerID: { type: String, required: true },
    title: String,
    visibility: {
      type: String,
      required: true,
      enum: ["PUBLIC", "FRIENDS_ONLY", "PRIVATE"],
    },
    description: String,
    traits: [templateTraitSchema],
  },
  { collection: "templates" }
);
export default templateSchema;
