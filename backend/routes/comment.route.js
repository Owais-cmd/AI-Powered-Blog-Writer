import express from 'express';

import { addComment, getCommentsByPost } from '../controllers/comment.controller.js';
import { verifier } from '../middlewares/auth.middleware.js';

const app = express.Router();

app.post('/', verifier, addComment);
app.get('/:postId', getCommentsByPost);

export default app;