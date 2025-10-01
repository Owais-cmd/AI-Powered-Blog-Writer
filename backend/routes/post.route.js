import express from 'express';

import {createPost , getPosts , likePost , myPosts ,deletePost, searchPost ,getPostById} from '../controllers/post.controller.js';
import { verifier } from '../middlewares/auth.middleware.js';

const app = express.Router();

app.post('/create', verifier ,createPost);
app.get('/all', verifier,getPosts);
app.post('/like/:id',verifier, likePost);
app.get('/myposts', verifier,myPosts);
app.delete('/delete/:id', verifier,deletePost);
app.post('/search', verifier,searchPost);
app.get('/post/:id', verifier,getPostById);

export default app;

