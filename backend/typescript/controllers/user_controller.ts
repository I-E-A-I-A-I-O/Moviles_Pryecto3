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
                    const titles = await client.query(queries.getUser.titles, [id]);
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
                        education: titles.rows,
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

    public async readJob(req: Request, res: Response) {
        const { id } = req.params;
        const client = await dbController.getClient();
        try {
            const response = await client.query(queries.getUser.job, [id]);
            res.status(200).json({
                title: 'Success',
                content: {
                    ...response.rows[0],
                    start: response.rows[0].start.toISOString().split('T')[0],
                    end: response.rows[0].end.toISOString().split('T')[0],
                },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                title: 'error',
                content: 'Error retrieving data',
            });
        }
    }

    public async readAward(req: Request, res: Response) {
        const { id } = req.params;
        const client = await dbController.getClient();
        try {
            const response = await client.query(queries.getUser.award, [id]);
            res.status(200).json({
                title: 'Success',
                content: {
                    ...response.rows[0],
                    date: response.rows[0].date.toISOString().split('T')[0],
                },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                title: 'error',
                content: 'Error retrieving data',
            });
        }
    }

    public async readProject(req: Request, res: Response) {
        const { id } = req.params;
        const client = await dbController.getClient();
        try {
            const response = await client.query(queries.getUser.project, [id]);
            res.status(200).json({
                title: 'Success',
                content: response.rows[0]
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                title: 'error',
                content: 'Error retrieving data',
            });
        }
    }

    public async readTitle(req: Request, res: Response) {
        const { id } = req.params;
        const client = await dbController.getClient();
        try {
            const response = await client.query(queries.getUser.title, [id]);
            res.status(200).json({
                title: 'Success',
                content: {
                    ...response.rows[0],
                    start: response.rows[0].start.toISOString().split('T')[0],
                    graduation: response.rows[0].graduation.toISOString().split('T')[0],
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                title: 'error',
                content: 'Error retrieving data',
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
            case 'job': {
                this.readJob(req, res);
                break;
            }
            case 'award': {
                this.readAward(req, res);
                break;
            }
            case 'project': {
                this.readProject(req, res);
                break;
            }
            case 'title': {
                this.readTitle(req, res);
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

    private async updateAvatar(req: Request, res: Response, id: string) {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const absolutePath = `media/avatars/${id}/${files.avatar[0].originalname}`;
            await fse.outputFile(absolutePath, files.avatar[0].buffer);
            res.status(200).json({
                title: 'success',
                content: 'Avatar updated!',
            });
        } catch (err) {
            res.status(500).json({
                title: 'error',
                content: 'Could not update the avatar.',
            });
        }
    }

    public async update(req: Request, res: Response, target: string) {
        const { authorization } = req.headers;
        if (authorization) {
            const payload = await jwt.getPayload(authorization);
            if (payload) {
                let params: any[] = [];
                let query: string;
                switch (target) {
                    case 'general': {
                        this.updateGeneral(req, res, payload.user_id);
                        return;
                    }
                    case 'ability-add': {
                        query = queries.insertUser.ability;
                        params.push(req.body.ability);
                        break;
                    }
                    case 'experience-add': {
                        params.push(
                            payload.user_id,
                            req.body.org_name,
                            req.body.description,
                            req.body.title,
                            req.body.startDate,
                            req.body.finishDate,
                        );
                        query = queries.insertUser.experience;
                        break;
                    }
                    case 'job-edit': {
                        params.push(
                            req.body.org_name,
                            req.body.title,
                            req.body.description,
                            req.body.startDate,
                            req.body.finishDate,
                            req.params.id,
                        );
                        query = queries.setUser.job;
                        break;
                    }
                    case 'award-add': {
                        params.push(
                            payload.user_id,
                            req.body.title,
                            req.body.description,
                            req.body.by,
                            req.body.date,
                        );
                        query = queries.insertUser.award;
                        break;
                    }
                    case 'award-edit': {
                        params.push(
                            req.body.title,
                            req.body.description,
                            req.body.by,
                            req.body.date,
                            req.params.id,
                        );
                        query = queries.setUser.award;
                        break;
                    }
                    case 'project-add': {
                        params.push(
                            payload.user_id,
                            req.body.title,
                            req.body.description,
                            req.body.link,
                        );
                        query = queries.insertUser.project;
                        break;
                    }
                    case 'project-edit': {
                        params.push(
                            req.body.title,
                            req.body.description,
                            req.body.link,
                            req.params.id,
                        );
                        query = queries.setUser.project;
                        break;
                    }
                    case 'title-add': {
                        params.push(
                            payload.user_id,
                            req.body.school,
                            req.body.title,
                            req.body.start,
                            req.body.graduation,
                        );
                        query = queries.insertUser.education;
                        break;
                    }
                    case 'title-edit': {
                        params.push(
                            req.body.school,
                            req.body.title,
                            req.body.start,
                            req.body.graduation,
                            req.params.id,
                        );
                        query = queries.setUser.education;
                        break;
                    }
                    case 'avatar': {
                        this.updateAvatar(req, res, payload.user_id);
                        return;
                    }
                    case 'name': {
                        params.push(
                            req.body.name,
                            payload.user_id,
                        );
                        query = queries.setUser.name;
                        break;
                    }
                    default: {
                        res.sendStatus(404);
                        return;
                    }
                }
                const client = await dbController.getClient();
                try {
                    const results = await client.query(query, params);
                    res.status(201).json({
                        title: 'success',
                        content: target === 'ability-add' ? results.rows[0] : 'Profile updated!',
                    });
                } catch (err) {
                    console.error(err);
                    res.status(500).json({
                        title: 'error',
                        content: 'Error updating the profile.',
                    });
                } finally {
                    client.release(true);
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

    public async delete(req: Request, res: Response, target: string) {
        const { authorization } = req.headers;
        if (authorization) {
            const payload = await jwt.getPayload(authorization);
            if (payload) {
                let query: string;
                switch (target) {
                    case 'ability-remove': {
                        query = queries.removeUser.ability;
                        break;
                    }
                    case 'experience-remove': {
                        query = queries.removeUser.experience;
                        break;
                    }
                    case 'award-remove': {
                        query = queries.removeUser.award;
                        break;
                    }
                    case 'project-remove': {
                        query = queries.removeUser.project;
                        break;
                    }
                    case 'title-remove': {
                        query = queries.removeUser.education;
                        break;
                    }
                    default: {
                        res.sendStatus(404);
                        return;
                    }
                }
                const { id } = req.params;
                const client = await dbController.getClient();
                try {
                    await client.query(query, [id]);
                    res.sendStatus(200);
                } catch (err) {
                    console.error(err);
                    res.status(500).json({
                        title: 'error',
                        content: 'Error updating the profile',
                    });
                } finally {
                    client.release(true);
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
}
