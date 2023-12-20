import express from "express";
import session from "express-session";
import * as dao from "./dao";
import { User, UserRole } from "./schema";
import mongoose from "mongoose";
import { ObjectId, validateObjectId } from "../utils";
import { Ok, Err, Result } from "ts-results";
const INVALID_USERID_ERROR_MESSAGE = "Invalid user ID given: ";
const MAX_USERNAME_LENGTH = 36;
const MAX_EMAIL_LENGTH = 254;
async function getUser(userId: string, res: any): Promise<Result<User, null>> {
  const validationResults = validateObjectId(userId);

  if (validationResults.err) {
    res.status(400).json({ message: INVALID_USERID_ERROR_MESSAGE + userId });
    return Err(null);
  }

  const userDoc = await dao.findUserById(validationResults.val);

  if (userDoc === null) {
    res.status(404).json({
      message: `User with the given ID (${userId}) could not be found.`,
    });
    return Err(null);
  }

  const email = userDoc.email || undefined;
  const user: User = {
    _id: userDoc._id,
    username: userDoc.username,
    role: userDoc.role as UserRole,
    email,
  };

  return Ok(user);
}

async function getSafeUser(
  userId: string,
  res: any
): Promise<Result<User, null>> {
  const result = await getUser(userId, res);
  if (result.err) {
    return Err(result.val);
  }
  const user = result.val;
  delete user.email;
  return Ok(user);
}

function UserRoutes(app: express.Express) {
  app.post("/api/users", async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  });

  // Require Authentication
  app.delete("/api/user/:userId", async (req, res) => {
    const result = validateObjectId(req.params.userId);
    if (result.err) {
      res
        .status(400)
        .json({ message: INVALID_USERID_ERROR_MESSAGE + req.params.userId });
      return;
    }
    const status = await dao.deleteUser(result.val);
    res.json(status);
  });

  app.get("/api/users/:userId", async (req, res) => {
    const result = await getSafeUser(req.params.userId, res);
    if (result.err) {
      return;
    }
    res.json(result.val);
  });

  app.get("/api/users/:userId/username", async (req, res) => {
    const result = await getUser(req.params.userId, res);
    if (result.err) {
      return;
    }
    res.json(result.val.username);
  });

  // TODO: Require authentication
  app.put("/api/users/:userId", async (req, res) => {
    const objIdResponse = validateObjectId(req.params.userId);
    if (objIdResponse.err) {
      res
        .status(400)
        .json({ message: INVALID_USERID_ERROR_MESSAGE + req.params.userId });
      return;
    }
    const userId = objIdResponse.val;
    const status = await dao.updateUser(userId, req.body);
    const userResponse = await getUser(req.params.userId, res);
    if (userResponse.err) {
      return;
    }
    req.session.user = userResponse.val;
    res.json(status);
  });

  const validateUsername = async (
    username: any,
    res: any
  ): Promise<Result<string, null>> => {
    let usernameString: string;
    try {
      usernameString = username as string;
    } catch (e) {
      res.status(400).json({
        message: "Given username could not be converted to a string.",
      });
      return Err(null);
    }

    if (
      username === undefined ||
      username === null ||
      usernameString.length <= 0
    ) {
      res.status(400).json({
        message: `Must give a username, server recieved: ${usernameString}`,
      });
      return Err(null);
    }
    if (usernameString.length > MAX_USERNAME_LENGTH) {
      res.status(400).json({
        message: `Given username is too long. The max username length is ${MAX_USERNAME_LENGTH} characters.`,
      });
      return Err(null);
    }
    const user = await dao.findUserByUsername(usernameString);
    if (user) {
      res.status(403).json({ message: "Username already taken" });
      return Err(null);
    }
    return Ok(usernameString);
  };
  const validatePassword = (username: any, res: any): Result<string, null> => {
    // If this were not a temporary solution, I would check to make sure it was a valid hash
    // TODO
    throw new Error("Function not implemented");
  };
  app.post("/api/users/signup", async (req, res) => {
    const usernamePromise = validateUsername(req.body.username, res);
    const passwordResult = validatePassword(req.body.password, res);
    const usernameResult = await usernamePromise;
    if (usernameResult.err || passwordResult.err) {
      return;
    }
    const newUser = {
      username: usernameResult.val,
      password: passwordResult.val,
    };
    const user = await dao.createUser(newUser);
    const returnedUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    req.session.user = returnedUser;
    res.status(201).json(returnedUser);
  });

  app.post("/api/users/signin", async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    req.session["currentUser"] = currentUser;
    res.status(200).json(currentUser);
  });

  app.post("/api/users/signout", (req, res) => {
    req.session.destroy();
    res.json(200);
  });

  app.post("/api/users/account", async (req, res) => {
    res.json(req.session["currentUser"]);
  });
}
export default UserRoutes;
