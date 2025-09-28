import express from "express";

import { updateUser } from "../controllers/user.controller.js";
import { verifier } from "../middlewares/auth.middleware.js";

const app = express.Router();

app.post("/update", verifier,updateUser);

export default app;