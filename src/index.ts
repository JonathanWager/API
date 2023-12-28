import express, { Request, Response } from 'express';
import { Post, PostModel } from './db';

const app = express();
const port = 3000;

app.use(express.json());

app.get('', (req: Request, res: Response) => {
    res.send('Welcome to my Express API!');
});

app.get('/posts', async (req: Request, res: Response) => {
    try {
        const posts = await PostModel.find();
        const postsWithId = posts.map((post) => ({ id: post._id.toString(), title: post.title, content: post.content }));
        res.json(postsWithId);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/posts/:id', async (req: Request, res: Response) => {
    const postId = req.params.id;
    try {
        const post = await PostModel.findById(postId);
        if (post) {
            res.json({ id: post._id.toString(), title: post.title, content: post.content });
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/posts', async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const newPost = new PostModel({ title, content });

    try {
        const savedPost = await newPost.save();
        res.status(201).json({ id: savedPost._id.toString(), title: savedPost.title, content: savedPost.content });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/posts/:id', async (req: Request, res: Response) => {
    const postId = req.params.id;
    const updatedPost = req.body;

    try {
        const post = await PostModel.findByIdAndUpdate(postId, updatedPost, { new: true });
        if (post) {
            res.json({ id: post._id.toString(), title: post.title, content: post.content });
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/posts/:id', async (req: Request, res: Response) => {
    const postId = req.params.id;

    try {
        const deletedPost = await PostModel.findByIdAndDelete(postId);
        if (deletedPost) {
            res.json({ message: 'Post deleted successfully' });
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});