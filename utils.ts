import mongoose from "mongoose";
import { Ok, Err, Result } from "ts-results";
export type ObjectId = mongoose.Types.ObjectId;
export function validateObjectId(objectId: string): Result<ObjectId, null> {
  if (!mongoose.isValidObjectId(objectId)) {
    return Err(null);
  }
  return Ok(new mongoose.Types.ObjectId(objectId));
}
