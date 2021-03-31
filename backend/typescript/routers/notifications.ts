import express, {Request, Response} from 'express';

import {notificationController} from '../controllers';

const router = express.Router();

router.post('/users', (req: Request, res: Response) => {
    notificationController.registerToken(req, res);
});

export default router;
