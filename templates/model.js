import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("templates", schema);
export default model;
