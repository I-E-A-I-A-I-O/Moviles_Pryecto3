import { Request, Response } from 'express';
import { dbController, queries, getRandomInt, mailer } from '../helpers';
import { BasicCRUD } from './controllers_defs/CRUD';

type ExistentCodes = {
    code: string
}

export class UserController extends BasicCRUD {

    private generateCode(existentCodes: ExistentCodes[]): string {
        const data = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += data[getRandomInt(data.length)];
        }
        for (let i = 0; i < existentCodes.length; i++) {
            if (existentCodes[i].code === code) {
                return this.generateCode(existentCodes);
            }
        }
        return code;
    }

    private async invalidateCode (verification_id: string) {
        const client = await dbController.getClient();
        try {
            await client.query(queries.invalidateCode, [verification_id]);
            console.info(`Verification code with ID ${verification_id} expired.`);
        } catch (err) {
            console.error(err);
        } finally {
            client.release(true);
        }
    }

    public async create(req: Request, res: Response) {
        const {name, email, phone} = req.body;
        const client = await dbController.getClient();
        try{
            let results = await client.query(queries.areCredentialsNew, [email, phone]);
            if (results.rowCount > 1) {
                res.status(400).json({
                    title: 'error',
                    content: 'Email or phone number already in use!', 
                });
            } else {
                results = await client.query(queries.getExistentCodes, ['PENDING']);
                const authCode = this.generateCode(results.rows);
                results = await client.query(queries.insertNewCode, [email, authCode, 'PENDING'])
                res.status(200).json({
                    title: 'success',
                    content: 'part 2'
                });
                mailer.sendCode(name, email, authCode);
                setTimeout((id: string) => {
                    this.invalidateCode(id);
                }, 300000, results.rows[0].verification_id);
            }
        } catch(err) {
            res.status(500).json({
                title: 'error',
                content: 'Could not complete registration. Try again later.',
            })
            console.error(err);
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