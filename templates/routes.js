import * as dao from "./dao.js";
function TemplateRoutes(app) {
  app.get("/api/template/:templateID", async (req, res) => {
    const { templateID } = req.params;
    const user = await dao.findTemplateById(templateID);
    res.send(user);
  });
  app.get("/api/templates/search/:searchQuery", async (req, res) => {
    const { searchQuery } = req.params;
    // TODO
  });
  app.get("/api/templates/:ownerID", async (req, res) => {
    const { ownerID } = req.params;
    const templates = await dao.findTemplatesByOwnerID(ownerID);
    res.send(templates);
  });
  app.post("/api/template/:ownerID", async (req, res) => {
    const { ownerID } = req.params;
    const newTemplate = {
      ...req.body,
      ownerID: ownerID,
    };
    const createdTemplate = await dao.createTemplate(newTemplate);
    res.send(createdTemplate);
  });
  app.post("/api/template/:ownerID/blank", async (req, res) => {
    const { ownerID } = req.params;
    const newTemplate = {
      ownerID: ownerID,
      visibility: "private",
      title: "",
      description: "",
      traits: [],
      ownerID: ownerID,
    };
    const createdTemplate = await dao.createTemplate(newTemplate);
    res.send(createdTemplate);
  });
  app.delete("/api/template/:templateID", async (req, res) => {
    const { templateID } = req.params;
    await dao.deleteTemplate(templateID);
    res.sendStatus(200);
  });
  app.put("/api/template/:templateID", async (req, res) => {
    const { templateID } = req.params;
    await dao.updateTemplate(templateID, req.body);
    res.sendStatus(204);
  });
}
export default TemplateRoutes;
