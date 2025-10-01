import express from 'express';

import { proofRead} from '../controllers/ai.controller.js';
import {verifier} from '../middlewares/auth.middleware.js';

const app = express.Router();

app.post('/proofRead',verifier,proofRead);

export default app;