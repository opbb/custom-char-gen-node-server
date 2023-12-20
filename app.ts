import "dotenv/config";
import express from "express";
import session from "express-session";
import mongoSession from "connect-mongodb-session";
import cors from "cors";
import mongoose from "mongoose";
import TemplateRoutes from "./templates/routes";
import CharacterRoutes from "./characters/routes";
import SongRoutes from "./songs/routes";
import UserRoutes from "./users/routes";
import RandomOptionsRoutes from "./randomOptions/routes";

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

if (isProduction) {
  if (process.env.DB_CONNECTION_STRING === undefined) {
    throw new Error(
      "DB_CONNECTION_STRING is undefined in a production environment"
    );
  }
  if (process.env.FRONTEND_URL === undefined) {
    throw new Error("FRONTEND_URL is undefined in a production environment");
  }
  if (process.env.PORT === undefined) {
    throw new Error("PORT is undefined in a production environment");
  }
  if (process.env.SESSION_SECRET === undefined) {
    throw new Error("SESSION_SECRET is undefined in a production environment");
  }
}
const DB_CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/custom-char-gen";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const PORT = process.env.PORT || 4000;
const SESSION_SECRET = process.env.SESSION_SECRET || "session secret";

mongoose.connect(DB_CONNECTION_STRING);
const app: express.Express = express();

const MongoDBStore = mongoSession(session);
const store = new MongoDBStore({
  uri: DB_CONNECTION_STRING,
  collection: "userSessions",
});
const sessionOptions: session.SessionOptions = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
  proxy: undefined,
  cookie: undefined,
};
if (isProduction) {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}
app.use(session(sessionOptions));

app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
);
app.use(express.json());

// Routes
TemplateRoutes(app);
CharacterRoutes(app);
SongRoutes(app);
UserRoutes(app);
RandomOptionsRoutes(app);

app.listen(PORT);
