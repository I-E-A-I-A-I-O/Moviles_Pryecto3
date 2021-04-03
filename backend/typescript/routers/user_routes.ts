import express, {Request, Response} from 'express';

import {
  userController,
  userSession,
  readUser,
  updateUser,
} from '../controllers';

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
  updateUser.update(req, res, 'general');
});

router.post('/user/abilities/ability', (req: Request, res: Response) => {
  updateUser.update(req, res, 'ability-add');
});

router.delete('/user/abilities/ability/:id', (req: Request, res: Response) => {
  updateUser.delete(req, res, 'ability-remove');
});

router.post('/user/jobs/job', (req: Request, res: Response) => {
  updateUser.update(req, res, 'experience-add');
});

router.delete('/user/jobs/job/:id', (req: Request, res: Response) => {
  updateUser.delete(req, res, 'experience-remove');
});

router.get('/user/jobs/job/:id', (req: Request, res: Response) => {
  readUser.readJob(req, res);
});

router.patch('/user/jobs/job/:id', (req: Request, res: Response) => {
  updateUser.update(req, res, 'job-edit');
});

router.get('/user/awards/award/:id', (req: Request, res: Response) => {
  readUser.readAward(req, res);
});

router.post('/user/awards/award', (req: Request, res: Response) => {
  updateUser.update(req, res, 'award-add');
});

router.patch('/user/awards/award/:id', (req: Request, res: Response) => {
  updateUser.update(req, res, 'award-edit');
});

router.delete('/user/awards/award/:id', (req: Request, res: Response) => {
  updateUser.delete(req, res, 'award-remove');
});

router.post('/user/projects/project', (req: Request, res: Response) => {
  updateUser.update(req, res, 'project-add');
});

router.get('/user/projects/project/:id', (req: Request, res: Response) => {
  readUser.readProject(req, res);
});

router.patch('/user/projects/project/:id', (req: Request, res: Response) => {
  updateUser.update(req, res, 'project-edit');
});

router.delete('/user/projects/project/:id', (req: Request, res: Response) => {
  updateUser.delete(req, res, 'project-remove');
});

router.post('/user/titles/title', (req: Request, res: Response) => {
  updateUser.update(req, res, 'title-add');
});

router.get('/user/titles/title/:id', (req: Request, res: Response) => {
  readUser.readTitle(req, res);
});

router.patch('/user/titles/title/:id', (req: Request, res: Response) => {
  updateUser.update(req, res, 'title-edit');
});

router.delete('/user/titles/title/:id', (req: Request, res: Response) => {
  updateUser.delete(req, res, 'title-remove');
});

router.put('/user/avatar', (req: Request, res: Response) => {
  userController.updateAvatar(req, res);
});

router.put('/user/name', (req: Request, res: Response) => {
  userController.updateName(req, res);
});

router.get('/user/:id/name', (req: Request, res: Response) => {
  readUser.readName(req, res);
});

router.delete('/user', (req: Request, res: Response) => {
  userController.delete(req, res);
});

router.put('/user/credentials/password', (req: Request, res: Response) => {
  userController.updatePassword(req, res);
});

router.put('/user/recovery/password', (req: Request, res: Response) => {
  userController.passwordRecovery(req, res);
});

router.put('/user/credentials/email', (req: Request, res: Response) => {
  userController.updateEmail(req, res);
});

router.put('/user/credentials/phone', (req: Request, res: Response) => {
  userController.updatePhone(req, res);
});

router.post('/user/credentials/password', (req: Request, res: Response) => {
  userController.verifyPassword(req, res);
});
