import express from 'express';

import {createPost , getPosts , likePost , myPosts ,deletePost, searchPost} from '../controllers/post.controller.js';
import { verifier } from '../middlewares/auth.middleware.js';

const app = express.Router();

app.post('/create', verifier ,createPost);
app.get('/all', verifier,getPosts);
app.post('/like/:id',verifier, likePost);
app.get('/myposts', verifier,myPosts);
app.delete('/delete/:id', verifier,deletePost);
app.post('/search', verifier,searchPost);

export default app;

