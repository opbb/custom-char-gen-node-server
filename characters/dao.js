import model from "./model.js";
export const createCharacter = (character) => model.create(character);
export const findAllCharacters = () => model.find();
export const findCharacterById = (characterID) => model.findById(characterID);
export const findCharactersByOwnerID = (ownerID) =>
  model.find({ ownerID: ownerID });
export const updateCharacter = (characterID, character) =>
  model.updateOne({ _id: characterID }, { $set: character });
export const deleteCharacter = (characterID) =>
  model.deleteOne({ _id: characterID });
