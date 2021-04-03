import {Request, Response} from 'express';
import {dbController, queries, jwt} from '../helpers';

export class UpdateUserDescription {
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
        id,
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
          b_date,
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

  public async update(req: Request, res: Response, target: string) {
    const {authorization} = req.headers;
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
            params.push(payload.user_id, req.body.ability);
            break;
          }
          case 'experience-add': {
            params.push(
              payload.user_id,
              req.body.org_name,
              req.body.description,
              req.body.title,
              req.body.startDate,
              req.body.finishDate
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
              req.params.id
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
              req.body.date
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
              req.params.id
            );
            query = queries.setUser.award;
            break;
          }
          case 'project-add': {
            params.push(
              payload.user_id,
              req.body.title,
              req.body.description,
              req.body.link
            );
            query = queries.insertUser.project;
            break;
          }
          case 'project-edit': {
            params.push(
              req.body.title,
              req.body.description,
              req.body.link,
              req.params.id
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
              req.body.graduation
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
              req.params.id
            );
            query = queries.setUser.education;
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
            content:
              target === 'ability-add' ? results.rows[0] : 'Profile updated!',
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
          content: 'Invalid token',
        });
      }
    } else {
      res.status(401).json({
        title: 'error',
        content: 'missing token',
      });
    }
  }

  public async delete(req: Request, res: Response, target: string) {
    const {authorization} = req.headers;
    if (authorization) {
      const payload = await jwt.getPayload(authorization);
      if (payload) {
        let query: string;
        const {id} = req.params;
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
          content: 'Invalid token',
        });
      }
    } else {
      res.status(401).json({
        title: 'error',
        content: 'missing token',
      });
    }
  }
}
