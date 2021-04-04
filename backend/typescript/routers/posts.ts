import express, {Request, Response} from 'express';
import {postCreation} from '../controllers';

export const router = express.Router({
  strict: true,
});

router.post('/post', (req: Request, res: Response) => {
  postCreation.post(req, res);
});
