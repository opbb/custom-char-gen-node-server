import model from "./model.js";
export const createRandomOptions = (randomOptions) =>
  model.create(randomOptions);
export const findAllRandomOptions = () => model.find();
export const findRandomOptionsById = (randomOptionsID) =>
  model.findById(randomOptionsID);
export const findMultipleRandomOptionsByOwnerID = (ownerID) =>
  model.find({ ownerID: ownerID });
export const updateRandomOptions = (randomOptionsID, randomOptions) =>
  model.updateOne({ _id: randomOptionsID }, { $set: randomOptions });
export const deleteRandomOptions = (randomOptionsID) =>
  model.deleteOne({ _id: randomOptionsID });
