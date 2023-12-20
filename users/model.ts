import mongoose from "mongoose";
import schema from "./schema";
const model = mongoose.model("users", schema);
export default model;
