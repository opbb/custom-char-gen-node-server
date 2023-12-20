import { ObjectId } from "../utils";
import model from "./model";
import { User } from "./schema";
export const createUser = (user: { username: string; password: string }) =>
  model.create(user);
export const findUserById = (userId: ObjectId) => model.findById(userId);
export const findUserByUsername = (username: string) =>
  model.findOne({ username: username });
export const findUserByCredentials = (username: string, password: string) =>
  model.findOne({ username, password });
export const updateUser = (userId: ObjectId, user: User) =>
  model.updateOne({ _id: userId }, { $set: user });
export const deleteUser = (userId: ObjectId) =>
  model.deleteOne({ _id: userId });
