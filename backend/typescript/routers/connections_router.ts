import express, {Request, Response} from 'express';
import {connections} from '../controllers';

export const router = express.Router({
    strict: true,
});

router.get('/status/:id', (req: Request, res: Response) => {
    connections.getUsersRelation(req, res);
});

router.post('/requests', (req: Request, res: Response) => {
  connections.createRequest(req, res);
});

router.delete('/connection/:id', (req: Request, res: Response) => {
  connections.deleteConnection(req, res);
});

router.delete('/request/:id', (req: Request, res: Response) => {
  connections.deleteRequest(req, res);
});

router.post('/connections', (req: Request, res: Response) => {
  connections.createConnection(req, res);
});
