import { Request, Response } from 'express';
import { dbController } from '../helpers';
import { BasicCRUD } from './controllers_defs/CRUD';

export class UserController extends BasicCRUD {
    public create(req: Request, res: Response) {
        console.log(JSON.stringify(req.body));
        res.status(200).send('asdasd');
    }

    public read(req: Request, res: Response) {

    }

    public update(req: Request, res: Response) {

    }

    public delete(req: Request, res: Response) {

    }
}