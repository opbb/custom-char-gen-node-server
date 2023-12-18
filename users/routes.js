import * as dao from "./dao.js";
async function getSafeUser(userID) {
  const user = await dao.findUserById(userID);
  delete user.password;
  return user;
}
function UserRoutes(app) {
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };
  // Require Authentication
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };
  const findUserById = async (req, res) => {
    const user = getSafeUser(req.params.userId);
    res.json(user);
  };
  const findUsernameById = async (req, res) => {
    const user = getSafeUser(req.params.userId);
    res.json(user.username);
  };
  // TODO: Require authentication
  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const status = await dao.updateUser(userId, req.body);
    const currentUser = await dao.findUserById(userId);
    req.session["currentUser"] = currentUser;
    res.json(status);
  };
  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  const signout = (req, res) => {
    req.session.destroy();
    res.json(200);
  };
  const account = async (req, res) => {
    res.json(req.session["currentUser"]);
  };
  app.post("/api/users", createUser);
  app.get("/api/users/:userId", findUserById);
  app.get("/api/users/:userId/username", findUsernameById);
  app.delete("/api/user/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/account", account);
  app.put("/api/users/:userId", updateUser);
}
export default UserRoutes;
