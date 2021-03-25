import express, { Request, Response } from 'express';

import {codeController} from '../controllers';

export const router = express.Router({
    strict: true
});

router.post('/code', (req: Request, res: Response) => {
   codeController.create(req, res);
});

router.put('/code/verify', (req: Request, res: Response) => {
    codeController.read(req, res);
});

router.put('/code', (req: Request, res: Response) => {
    codeController.update(req, res);
});
