import express, { Request, Response } from 'express';

import { userController, userLogin } from '../controllers';

export const router = express.Router({
    strict: true
});

router.post('/user', (req: Request, res: Response) => {
    userController.create(req, res);
});

router.post('/user/auth/verify', (req: Request, res: Response) => {
    userLogin.userLogin(req, res);
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
    userController.update(req, res, 'ability-remove');
});
