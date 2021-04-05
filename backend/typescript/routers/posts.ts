import express, {Request, Response} from 'express';
import {
  editPost,
  postCreation,
  readPost,
  postInteractions,
} from '../controllers';

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

router.get('/post/:id/comments', (req: Request, res: Response) => {
  readPost.comments(req, res);
});

router.put('/post/:id', (req: Request, res: Response) => {
  editPost.edit(req, res);
});

router.delete('/post/:id', (req: Request, res: Response) => {
  editPost.delete(req, res);
});

router.get('/post/:id/interaction/state', (req: Request, res: Response) => {
  postInteractions.currentState(req, res);
});

router.put('/post/:id/like', (req: Request, res: Response) => {
  postInteractions.like(req, res);
});

router.put('/post/:id/dislike', (req: Request, res: Response) => {
  postInteractions.dislike(req, res);
});

router.get('/post/:id/interactions/count', (req: Request, res: Response) => {
  readPost.interactionCount(req, res);
});
