import model from "./model.js";
export const createTemplate = (template) => model.create(template);
export const findAllTemplates = () => model.find();
export const findTemplateById = (templateID) => model.findById(templateID);
export const findTemplatesByOwnerID = (ownerID) =>
  model.find({ ownerID: ownerID });
export const updateTemplate = (templateID, template) =>
  model.updateOne({ _id: templateID }, { $set: template });
export const deleteTemplate = (templateID) =>
  model.deleteOne({ _id: templateID });
