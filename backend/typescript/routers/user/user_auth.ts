import express, {Request, Response} from 'express';

import {userSession, userAuth} from '../../controllers';

export const router = express.Router({
  strict: true,
});

router.post('/user/auth/verify', (req: Request, res: Response) => {
  userSession.userLogin(req, res);
});

router.delete('/user/auth', (req: Request, res: Response) => {
  userSession.UserLogout(req, res);
});

router.put('/user/recovery/password', (req: Request, res: Response) => {
  userAuth.passwordRecovery(req, res);
});

router.post('/user/credentials/password', (req: Request, res: Response) => {
  userAuth.verifyPassword(req, res);
});
