import express, { Request, Response } from 'express';

import { userController, userLogin } from '../controllers';

export const router = express.Router({
    strict: true
});

router.post('/', (req: Request, res: Response) => {
    userController.create(req, res);
})

router.post('/userLogin', (req: Request, res: Response) => {
    userLogin.userLogin(req, res);
})

