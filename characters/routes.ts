import * as dao from "./dao";
function CharacterRoutes(app) {
  app.get("/api/character/:characterID", async (req, res) => {
    const { characterID } = req.params;
    const character = await dao.findCharacterById(characterID);
    res.send(character);
  });
  app.get("/api/characters/search/:searchQuery", async (req, res) => {
    const { searchQuery } = req.params;
  });
  app.get("/api/characters/featured", async (req, res) => {
    const characters = await dao.findAllCharacters();
    res.send(characters);
  });
  app.get("/api/characters/:ownerID", async (req, res) => {
    const { ownerID } = req.params;
    const characters = await dao.findCharactersByOwnerID(ownerID);
    res.send(characters);
  });
  app.post("/api/character/:ownerID", async (req, res) => {
    const { ownerID } = req.params;
    const newCharacter = {
      ...req.body,
      ownerID: ownerID,
    };
    delete newCharacter._id;
    const createdCharacter = await dao.createCharacter(newCharacter);
    res.send(createdCharacter);
  });
  app.delete("/api/character/:characterID", async (req, res) => {
    const { characterID } = req.params;
    await dao.deleteCharacter(characterID);
    res.sendStatus(200);
  });
  app.put("/api/character/:characterID", async (req, res) => {
    const { characterID } = req.params;
    await dao.updateCharacter(characterID, req.body);
    res.sendStatus(204);
  });
}
export default CharacterRoutes;
