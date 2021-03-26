import { Request, Response } from 'express';
import { dbController, queries } from '../helpers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class UserLogin {

    public async userLogin(req: Request, res: Response) {
        const { email, password } = req.body;
        const client = await dbController.getClient();
        try {
            let results = await client.query(queries.getUser.credentials, [email]);
            if (results.rowCount > 0) {
                const compare = await bcrypt.compare(password, results.rows[0].password);
                if (!compare) {
                    res.status(401).json({
                        title: 'error',
                        content: 'Incorrect password',
                    });
                } else {
                    const token = jwt.sign({
                        user_id: results.rows[0].user_id,
                    }, process.env.SECRET_JWT as jwt.Secret);
                    res.status(200).json({
                        title: 'success',
                        content: {
                            user_id: results.rows[0].user_id,
                            name: results.rows[0].name,
                            token: token,
                        },
                    });
                }
            } else {
                res.status(404).json({
                    title: 'error',
                    content: 'Email not found',
                });
            }
        } catch (err) {
            console.error(err);
            res.status(503).json({
                title: 'error',
                content: 'Could not verify credentials. Try again later',
            });
        } finally {
            client.release(true);
        }
    }
}
