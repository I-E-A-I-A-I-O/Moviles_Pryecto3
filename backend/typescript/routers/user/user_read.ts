import express, {Request, Response} from 'express';

import {readUser} from '../../controllers';

export const router = express.Router({
  strict: true,
});

router.get('/user/:id/avatar', (req: Request, res: Response) => {
  readUser.readAvatar(req, res);
});

router.get('/user/:id', (req: Request, res: Response) => {
  readUser.readProfile(req, res);
});

router.get('/user/jobs/job/:id', (req: Request, res: Response) => {
  readUser.readJob(req, res);
});

router.get('/user/awards/award/:id', (req: Request, res: Response) => {
  readUser.readAward(req, res);
});

router.get('/user/projects/project/:id', (req: Request, res: Response) => {
  readUser.readProject(req, res);
});

router.get('/user/titles/title/:id', (req: Request, res: Response) => {
  readUser.readTitle(req, res);
});

router.get('/user/:id/name', (req: Request, res: Response) => {
  readUser.readName(req, res);
});
