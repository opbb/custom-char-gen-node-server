import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("randomOptions", schema);
export default model;
