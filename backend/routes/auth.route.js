import express from 'express';
import bcrypt from 'bcrypt';

import { signin, login, getUser, getMe, logout } from '../controllers/auth.controller.js';
import { verifier } from '../middlewares/auth.middleware.js';

const app = express.Router();

app.post('/signin', signin);
app.post('/login', login);
app.get('/getUser/:id', verifier,getUser);
app.post('/logout', logout);
app.get('/me', verifier, getMe);



export default app;