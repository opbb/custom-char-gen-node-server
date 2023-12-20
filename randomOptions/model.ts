import mongoose from "mongoose";
import schema from "./schema";
const model = mongoose.model("randomOptions", schema);
export default model;
