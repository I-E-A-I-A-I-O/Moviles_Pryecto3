import express, {Request, Response} from 'express';

import {post} from '../controllers';

export const router = express.Router({
  strict: true,
});

router.post('/dataPost', (req: Request, res: Response) => {
  post.create(req,res);
});

router.get('/readerPost',(req: Request, res: Response)=>{
  post.read(req,res);
});

router.put('/updatePost', (req: Request, res: Response) =>{
  post.update(req,res);
});

router.delete('/deletePost', (id:string)=>{
  post.delete(id);
})