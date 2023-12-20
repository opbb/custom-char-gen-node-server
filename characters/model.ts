import mongoose from "mongoose";
import schema from "./schema";
const model = mongoose.model("characters", schema);
export default model;
