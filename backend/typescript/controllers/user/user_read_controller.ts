import {Request, Response} from 'express';
import {dbController, queries, jwt} from '../../helpers';
import fse from 'fs-extra';

export class ReadUserDescription {
  public async readJob(req: Request, res: Response) {
    const {id} = req.params;
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
    const {id} = req.params;
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
    const {id} = req.params;
    const client = await dbController.getClient();
    try {
      const response = await client.query(queries.getUser.project, [id]);
      res.status(200).json({
        title: 'Success',
        content: response.rows[0],
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
    const {id} = req.params;
    const client = await dbController.getClient();
    try {
      const response = await client.query(queries.getUser.title, [id]);
      res.status(200).json({
        title: 'Success',
        content: {
          ...response.rows[0],
          start: response.rows[0].start.toISOString().split('T')[0],
          graduation: response.rows[0].graduation.toISOString().split('T')[0],
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

  public async readName(req: Request, res: Response) {
    const {id} = req.params;
    const client = await dbController.getClient();
    try {
      const response = await client.query(queries.getUser.name, [id]);
      res.status(200).json({
        name: response.rows[0].name,
        last_name: response.rows[0].last_name,
      });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    } finally {
      client.release(true);
    }
  }

  public async readAvatar(req: Request, res: Response) {
    const {id} = req.params;
    const client = await dbController.getClient();
    try {
      const results = await client.query(queries.getUser.avatar, [id]);
      if (results.rowCount > 0) {
        const path: string = results.rows[0].avatar;
        const base64String = await fse.readFile(path, {encoding: 'base64'});
        const type = path.split('.')[1];
        const mimeType = `image/${type}`;
        const data = `data:${mimeType};base64,${base64String}`;
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

  public async readProfile(req: Request, res: Response) {
    const {id} = req.params;
    const {authorization} = req.headers;
    if (authorization) {
      const payload = await jwt.getPayload(authorization);
      if (payload) {
        const client = await dbController.getClient();
        try {
          const name = await client.query(queries.getUser.name, [id]);
          const abilites = await client.query(queries.getUser.abilites, [id]);
          const awards = await client.query(queries.getUser.awards, [id]);
          const titles = await client.query(queries.getUser.titles, [id]);
          const experience = await client.query(queries.getUser.experience, [
            id,
          ]);
          const projects = await client.query(queries.getUser.projects, [id]);
          const recommendations = await client.query(
            queries.getUser.recommendations,
            [id]
          );
          const description = await client.query(queries.getUser.description, [
            id,
          ]);
          const resBody = {
            name: name.rows[0].name,
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
}
