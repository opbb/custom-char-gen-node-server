import * as dao from "./dao.js";
import { createCharacter } from "../characters/dao.js";
import { findRandomOptionsById } from "../randomOptions/dao.js";
function TemplateRoutes(app) {
  app.get("/api/template/:templateID", async (req, res) => {
    const { templateID } = req.params;
    const template = await dao.findTemplateById(templateID);
    res.send(template);
  });
  app.get("/api/templates/search/:searchQuery", async (req, res) => {
    const { searchQuery } = req.params;
    // TODO
  });
  app.get("/api/templates/featured", async (req, res) => {
    const templates = await dao.findAllTemplates();
    res.send(templates);
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
    delete newTemplate._id;
    const createdTemplate = await dao.createTemplate(newTemplate);
    res.send(createdTemplate);
  });
  app.post("/api/template/:templateID/:ownerID/generate", async (req, res) => {
    const { templateID, ownerID } = req.params;
    const template = await dao.findTemplateById(templateID);
    const generatableTraits = template.traits.filter(
      (trait) =>
        trait.randomOptionsID !== null && trait.randomOptionsID !== undefined
    );
    const randomOptionsPromises = generatableTraits.map((trait) =>
      findRandomOptionsById(trait.randomOptionsID)
    );
    const allRandomOptions = await Promise.all(randomOptionsPromises);
    const generatedTraits = generatableTraits.map((trait, index) => {
      const randomOptions = allRandomOptions[index];
      // TODO: Turn this into a switch case
      let traitValue;
      if (randomOptions.type === "list") {
        traitValue =
          randomOptions.optionsList[
            Math.floor(Math.random() * randomOptions.optionsList.length)
          ];
      } else {
        console.log(randomOptions);
        const start =
          randomOptions.start !== undefined && randomOptions.start !== null
            ? parseInt(randomOptions.start)
            : 0;
        const stop =
          randomOptions.end !== undefined && randomOptions.end !== null
            ? parseInt(randomOptions.end)
            : 0;
        // const step =
        //   (randomOptions.step &&
        //     randomOptions.step !== 0 &&
        //     randomOptions.step) ||
        //   1;

        const min = Math.min(start, stop);
        const max = Math.max(start, stop);
        console.log(`Start: ${start}, Stop: ${stop}, Min: ${min}, Max ${max}`);
        traitValue = Math.floor(Math.random() * (max - min)) + min;
        console.log(`Value: ${traitValue}`);
      }
      return {
        title: trait.title,
        type: trait.type,
        value: traitValue,
      };
    });
    const generatedCharacter = {
      ownerID: ownerID,
      visibility: "private",
      traits: generatedTraits,
    };
    const createdCharacter = await createCharacter(generatedCharacter);
    res.send(createdCharacter);
  });
  app.post("/api/template/:ownerID/blank", async (req, res) => {
    const { ownerID } = req.params;
    const newTemplate = {
      ownerID: ownerID,
      visibility: "private",
      title: "",
      description: "",
      traits: [],
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
