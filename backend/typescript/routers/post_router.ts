import express, {Request, Response} from 'express';

import {post} from '../controllers';

export const router = express.Router({
  strict: true,
});

router.post('/dataPost', (req: Request, res: Response) => {
  post.create(req,res);
  console.log('Este es el primer metodo')
});