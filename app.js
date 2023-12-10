import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";
import mongoose from "mongoose";
import TemplateRoutes from "./templates/routes.js";
mongoose.connect(
  process.env.DB_CONNECTION_STRING ||
    "mongodb://127.0.0.1:27017/custom-char-gen"
);
const app = express();
const sessionOptions = {
  secret: "any string",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
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
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);
app.use(cors());
app.use(express.json());

// Put routes here
TemplateRoutes(app);

app.listen(process.env.PORT || 4000);
