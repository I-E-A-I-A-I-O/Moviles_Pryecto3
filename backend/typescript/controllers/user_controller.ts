import { Request, Response } from 'express';
import { dbController, queries, jwt } from '../helpers';
import { BasicCRUD } from './controllers_defs/CRUD';
import fse from 'fs-extra';
import bcrypt from 'bcrypt';

export class UserController extends BasicCRUD {

    public async create(req: Request, res: Response) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const { name, email, phone, password } = req.body;
        const client = await dbController.getClient();
        try {
            await client.query(queries.transaction.begin);
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(password, salt);
            let results = await client.query(queries.insertUser.new, [name, email, phone, hash]);
            const user_id: string = results.rows[0].user_id;
            if (!files.avatar) {
                await client.query(queries.transaction.commit);
                res.status(201).json({
                    title: 'success',
                    content: 'Account registered!',
                });
            } else {
                const absolutePath = `media/avatars/${user_id}/${files.avatar[0].originalname}`;
                await fse.outputFile(absolutePath, files.avatar[0].buffer);
                await client.query(queries.setUser.avatar, [absolutePath, user_id]);
                await client.query(queries.transaction.commit);
                res.status(201).json({
                    title: 'success',
                    content: 'Account registered!',
                });
            }
        } catch (err) {
            console.error(err);
            await client.query(queries.transaction.rollback);
            res.status(503).json({
                title: 'error',
                content: 'Could not complete the registration.'
            })
        } finally {
            client.release(true);
        }
    }

    private async readAvatar(req: Request, res: Response) {
        const { id } = req.params;
        const client = await dbController.getClient();
        try {
            const results = await client.query(queries.getUser.avatar, [id]);
            if (results.rowCount > 0) {
                const path: string = results.rows[0].avatar;
                const base64String = await fse.readFile(path, { encoding: 'base64' })
                const type = path.split(".")[1];
                const mimeType = `image/${type}`;
                const data = `data:${mimeType};base64,${base64String}`
                res.status(200).send(data);
            } else {
                res.sendStatus(404);
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(503);
        } finally {
            client.release(true);
        }
    }

    private async readProfile(req: Request, res: Response) {
        const { id } = req.params;
        const { authorization } = req.headers;
        if (authorization) {
            const payload = await jwt.getPayload(authorization);
            if (payload) {
                const client = await dbController.getClient();
                try {
                    const abilites = await client.query(queries.getUser.abilites, [id]);
                    const awards = await client.query(queries.getUser.awards, [id]);
                    const experience = await client.query(queries.getUser.experience, [id]);
                    const projects = await client.query(queries.getUser.projects, [id]);
                    const recommendations = await client.query(queries.getUser.recommendations, [id]);
                    const description = await client.query(queries.getUser.description, [id]);
                    const resBody = {
                        abilities: abilites.rows,
                        awards: awards.rows,
                        experience: experience.rows,
                        projects: projects.rows,
                        recommendations: recommendations.rows,
                        description: description.rows[0] ?? undefined,
                    };
                    res.status(200).json(resBody);
                } catch (err) {
                    console.error(err);
                    res.status(503).json({
                        title: 'error',
                        content: 'Error retrieving iformation',
                    });
                } finally {
                    client.release(true);
                }
            } else {
                res.status(403).json({
                    title: 'error',
                    content: 'invalid token',
                });
            }
        } else {
            res.status(403).json({
                title: 'error',
                content: 'missing token',
            });
        }
    }

    public read(req: Request, res: Response, target: string) {
        switch (target) {
            case 'avatar': {
                this.readAvatar(req, res);
                break;
            }
            case 'profile': {
                this.readProfile(req, res);
                break;
            }
            default: {
                res.sendStatus(404);
                break;
            }
        }
    }

    private async updateGeneral(req: Request, res: Response, id: string) {
        const {
            last_name,
            age,
            gender,
            description,
            country,
            address,
            b_date,
        } = req.body;
        const client = await dbController.getClient();
        try {
            const results = await client.query(queries.setUser.description, [
                description,
                country,
                age,
                gender,
                address,
                last_name,
                b_date,
                id
            ]);
            if (results.rowCount > 0) {
                res.status(201).json({
                    title: 'success',
                    content: 'Profile updated',
                });
            } else {
                await client.query(queries.insertUser.description, [
                    id,
                    last_name,
                    gender,
                    address,
                    country,
                    age,
                    description,
                    b_date
                ]);
                res.status(200).json({
                    title: 'success',
                    content: 'Profile updated',
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({
                title: 'error',
                content: 'Could not update general information.',
            });
        } finally {
            client.release(true);
        }
    }

    private async addAbility(req: Request, res: Response, id: string) {
        const client = await dbController.getClient();
        try {
            const results = await client.query(queries.insertUser.ability, [id, req.body.ability]);
            res.status(201).json({
                title: 'success',
                content: results.rows[0],
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                title: 'error',
                content: 'Could not save the new ability',
            });
        } finally {
            client.release(true);
        }
    }

    private async removeAbility(req: Request, res: Response) {
        const client = await dbController.getClient();
        try {
            await client.query(queries.removeUser.ability, [req.params.id]);
            res.sendStatus(200);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                title: 'error',
                content: 'Could delete the ability',
            });
        } finally {
            client.release(true);
        }
    }

    public async update(req: Request, res: Response, target: string) {
        const { authorization } = req.headers;
        if (authorization) {
            const payload = await jwt.getPayload(authorization);
            if (payload) {
                switch (target) {
                    case 'general': {
                        this.updateGeneral(req, res, payload.user_id);
                        break;
                    }
                    case 'ability-add': {
                        this.addAbility(req, res, payload.user_id);
                        break;
                    }
                    case 'ability-remove': {
                        this.removeAbility(req, res);
                        break;
                    }
                    default: {
                        res.sendStatus(404);
                        break;
                    }
                }
            } else {
                res.status(401).json({
                    title: 'error',
                    content: 'Invalid token'
                })
            }
        } else {
            res.status(401).json({
                title: 'error',
                content: 'missing token',
            })
        }
    }

    public delete(req: Request, res: Response) {

    }
}