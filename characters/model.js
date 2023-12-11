import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("characters", schema);
export default model;
