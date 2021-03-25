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
