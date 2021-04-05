import express, {Request, Response} from 'express';
import {postCreation, readPost} from '../controllers';

export const router = express.Router({
  strict: true,
});

router.post('/post', (req: Request, res: Response) => {
  postCreation.post(req, res);
});

router.get('/post/:id', (req: Request, res: Response) => {
  readPost.read(req, res);
});

router.post('/post/:id/comment', (req: Request, res: Response) => {
  postCreation.comment(req, res);
});
