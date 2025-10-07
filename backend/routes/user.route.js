import express from "express";

import { updateUser , getUserPosts } from "../controllers/user.controller.js";
import { verifier } from "../middlewares/auth.middleware.js";

const app = express.Router();

app.post("/update", verifier,updateUser);
app.get("/:name",verifier,getUserPosts);

export default app;