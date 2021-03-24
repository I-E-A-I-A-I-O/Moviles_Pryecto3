import { Request, Response } from 'express';
import { dbController, queries } from '../helpers';
import { BasicCRUD } from './controllers_defs/CRUD';
import fse from 'fs-extra';
import bcrypt from 'bcrypt';

export class UserController extends BasicCRUD {

    public async create(req: Request, res: Response) {
        const files = req.files as {[fieldname: string]: Express.Multer.File[]};
        const {name, email, phone, password} = req.body;
        const client = await dbController.getClient();
        try {
            await client.query(queries.begin);
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(password, salt);
            let results = await client.query(queries.registerUser, [name, email, phone, hash]);
            const user_id: string = results.rows[0].user_id;
            if (!files.avatar) {
                await client.query(queries.commit);
                res.status(200).json({
                    title: 'success',
                    content: 'Account registered!',
                });
            } else {
                const path = `media/avatars/${user_id}`;
                const absolutePath = `${path}/${files.avatar[0].originalname}`;
                await fse.ensureDir(path);
                await fse.outputFile(absolutePath, files.avatar[0].buffer);
                await client.query(queries.setAvatar, [absolutePath, user_id]);
                await client.query(queries.commit);
                res.status(200).json({
                    title: 'success',
                    content: 'Account registered!',
                });
            }
        } catch (err) {
            console.error(err);
            await client.query(queries.rollback);
            res.status(500).json({
                title: 'error',
                content: 'Could not complete the registration.'
            })
        } finally {
            client.release(true);
        }
    }

    public read(req: Request, res: Response) {

    }

    public update(req: Request, res: Response) {

    }

    public delete(req: Request, res: Response) {

    }
}