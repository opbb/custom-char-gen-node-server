import * as dao from "./dao.js";
function RandomOptionsRoutes(app) {
  app.get("/api/randomOptions/:randomOptionsID", async (req, res) => {
    const { randomOptionsID } = req.params;
    const randomOptions = await dao.findRandomOptionsById(randomOptionsID);
    res.send(randomOptions);
  });
  app.get(
    "/api/multipleRandomOptions/search/:searchQuery",
    async (req, res) => {
      const { searchQuery } = req.params;
      // TODO
    }
  );
  app.get("/api/multipleRandomOptions/featured", async (req, res) => {
    const multipleRandomOptions = await dao.findAllRandomOptions();
    res.send(multipleRandomOptions);
  });
  app.get("/api/multipleRandomOptions/:ownerID", async (req, res) => {
    const { ownerID } = req.params;
    const multipleRandomOptions = await dao.findMultipleRandomOptionsByOwnerID(
      ownerID
    );
    res.send(multipleRandomOptions);
  });
  app.post("/api/randomOptions/:ownerID", async (req, res) => {
    const { ownerID } = req.params;
    const newRandomOptions = {
      ...req.body,
      ownerID: ownerID,
    };
    delete newRandomOptions._id;
    const createdRandomOptions = await dao.createRandomOptions(
      newRandomOptions
    );
    res.send(createdRandomOptions);
  });
  app.post("/api/randomOptions/:ownerID/blank", async (req, res) => {
    const { ownerID } = req.params;
    const newRandomOptions = {
      ownerID: ownerID,
      visibility: "private",
      title: "",
      description: "",
      type: "list",
      optionsList: [],
      start: 0,
      end: 0,
      step: 0,
    };
    const createdRandomOptions = await dao.createRandomOptions(
      newRandomOptions
    );
    res.send(createdRandomOptions);
  });
  app.delete("/api/randomOptions/:randomOptionsID", async (req, res) => {
    const { randomOptionsID } = req.params;
    await dao.deleteRandomOptions(randomOptionsID);
    res.sendStatus(200);
  });
  app.put("/api/randomOptions/:randomOptionsID", async (req, res) => {
    const { randomOptionsID } = req.params;
    await dao.updateRandomOptions(randomOptionsID, req.body);
    res.sendStatus(204);
  });
}
export default RandomOptionsRoutes;
