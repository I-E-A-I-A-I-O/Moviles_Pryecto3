import express, {Request, Response} from 'express';

import {userController, userSession} from '../controllers';

export const router = express.Router({
  strict: true,
});

router.post('/user', (req: Request, res: Response) => {
  userController.create(req, res);
});

router.post('/user/auth/verify', (req: Request, res: Response) => {
  userSession.userLogin(req, res);
});

router.delete('/user/auth', (req: Request, res: Response) => {
  userSession.UserLogout(req, res);
});

router.get('/user/:id/avatar', (req: Request, res: Response) => {
  userController.read(req, res, 'avatar');
});

router.get('/user/:id', (req: Request, res: Response) => {
  userController.read(req, res, 'profile');
});

router.patch('/user/general', (req: Request, res: Response) => {
  userController.update(req, res, 'general');
});

router.post('/user/abilities/ability', (req: Request, res: Response) => {
  userController.update(req, res, 'ability-add');
});

router.delete('/user/abilities/ability/:id', (req: Request, res: Response) => {
  userController.delete(req, res, 'ability-remove');
});

router.post('/user/jobs/job', (req: Request, res: Response) => {
  userController.update(req, res, 'experience-add');
});

router.delete('/user/jobs/job/:id', (req: Request, res: Response) => {
  userController.delete(req, res, 'experience-remove');
});

router.get('/user/jobs/job/:id', (req: Request, res: Response) => {
  userController.read(req, res, 'job');
});

router.patch('/user/jobs/job/:id', (req: Request, res: Response) => {
  userController.update(req, res, 'job-edit');
});

router.get('/user/awards/award/:id', (req: Request, res: Response) => {
  userController.read(req, res, 'award');
});

router.post('/user/awards/award', (req: Request, res: Response) => {
  userController.update(req, res, 'award-add');
});

router.patch('/user/awards/award/:id', (req: Request, res: Response) => {
  userController.update(req, res, 'award-edit');
});

router.delete('/user/awards/award/:id', (req: Request, res: Response) => {
  userController.delete(req, res, 'award-remove');
});

router.post('/user/projects/project', (req: Request, res: Response) => {
  userController.update(req, res, 'project-add');
});

router.get('/user/projects/project/:id', (req: Request, res: Response) => {
  userController.read(req, res, 'project');
});

router.patch('/user/projects/project/:id', (req: Request, res: Response) => {
  userController.update(req, res, 'project-edit');
});

router.delete('/user/projects/project/:id', (req: Request, res: Response) => {
  userController.delete(req, res, 'project-remove');
});

router.post('/user/titles/title', (req: Request, res: Response) => {
  userController.update(req, res, 'title-add');
});

router.get('/user/titles/title/:id', (req: Request, res: Response) => {
  userController.read(req, res, 'title');
});

router.patch('/user/titles/title/:id', (req: Request, res: Response) => {
  userController.update(req, res, 'title-edit');
});

router.delete('/user/titles/title/:id', (req: Request, res: Response) => {
  userController.delete(req, res, 'title-remove');
});

router.put('/user/avatar', (req: Request, res: Response) => {
  userController.update(req, res, 'avatar');
});

router.put('/user/name', (req: Request, res: Response) => {
  userController.update(req, res, 'name');
});

router.get('/user/:id/name', (req: Request, res: Response) => {
  userController.readName(req, res);
});
