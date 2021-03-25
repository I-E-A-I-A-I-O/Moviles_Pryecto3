import express, { Request, Response } from 'express';

import { userController, codeController, userLogin } from '../controllers';

export const router = express.Router({
    strict: true
});

router.post('/codes/', (req: Request, res: Response) => {
   codeController.create(req, res);
});

router.post('/codes/code/', (req: Request, res: Response) => {
    codeController.read(req, res);
});

router.put('/codes/code/', (req: Request, res: Response) => {
    codeController.update(req, res);
});

router.post('/', (req: Request, res: Response) => {
    userController.create(req, res);
});

router.post('/userLogin', (req: Request, res: Response) => {
    userLogin.userLogin(req, res);
})

