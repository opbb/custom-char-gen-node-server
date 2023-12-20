import mongoose from "mongoose";
import schema from "./schema";
const model = mongoose.model("templates", schema);
export default model;
