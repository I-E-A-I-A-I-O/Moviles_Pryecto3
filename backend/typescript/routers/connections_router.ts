import express, {Request, Response} from 'express';
import {connections} from '../controllers';

export const router = express.Router({
    strict: true,
});

router.get('/status/:id', (req: Request, res: Response) => {
    connections.getUsersRelation(req, res);
});
