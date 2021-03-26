import { Request, Response } from 'express';
import { dbController, queries, getRandomInt, mailer } from '../helpers';
import { CodeCRUD } from './controllers_defs/CRUD';

type ExistentCodes = {
    code: string
}

export class CodeController extends CodeCRUD {

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

    public async create(req: Request, res: Response) {
        const { name, email, phone } = req.body;
        const client = await dbController.getClient();
        try {
            let results = await client.query(queries.getUser.areCredentialsNew, [email, phone]);
            if (results.rowCount > 0) {
                res.status(401).json({
                    title: 'error',
                    content: 'Email or phone number already in use!',
                });
            } else {
                results = await client.query(queries.verification_codes.getExistentCodes, ['PENDING']);
                const authCode = this.generateCode(results.rows);
                results = await client.query(queries.verification_codes.insertNewCode, [email, authCode, 'PENDING'])
                res.status(201).json({
                    title: 'success',
                    content: results.rows[0].verification_id,
                });
                mailer.sendCode(name, email, authCode);
                setTimeout((id: string) => {
                    this.delete(id);
                }, 300000, results.rows[0].verification_id);
            }
        } catch (err) {
            res.status(503).json({
                title: 'error',
                content: 'Could not complete registration. Try again later.',
            })
            console.error(err);
        } finally {
            client.release(true);
        }
    }

    public async update(req: Request, res: Response) {
        await this.delete(req.body.verification_id);
        this.create(req, res);
    }

    protected async delete(verification_id: string) {
        const client = await dbController.getClient();
        try {
            await client.query(queries.verification_codes.invalidateCode, [verification_id]);
            console.info(`Verification code with ID ${verification_id} expired at ${(new Date(Date.now())).toISOString()}.`);
        } catch (err) {
            console.error(err);
        } finally {
            client.release(true);
        }
    }

    public async read(req: Request, res: Response) {
        const {verification_id, code} = req.body;
        const client = await dbController.getClient();
        try {
            let results = await client.query(queries.verification_codes.verifyCode, [verification_id, code, 'PENDING']);
            if (results.rowCount > 0) {
                await client.query(queries.verification_codes.setCompleted, ['COMPLETED', verification_id]);
                res.sendStatus(204);
            } else {
                res.status(404).json({
                    title: 'error',
                    content: 'Invalid code',
                })
            }
        } catch(err) {
            console.error(err);
            res.status(503).json({
                title: 'error',
                content: 'Could not verify code',
            });
        } finally {
            client.release(true);
        }
    }
}