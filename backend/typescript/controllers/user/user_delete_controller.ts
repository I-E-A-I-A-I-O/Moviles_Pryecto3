import {Request, Response} from 'express';
import {dbController, queries, jwt} from '../../helpers';

export class DeleteUserDescription {
  public async removeDescription(req: Request, res: Response, query: string) {
    const {authorization} = req.headers;
    if (authorization) {
      const payload = await jwt.getPayload(authorization);
      if (payload) {
        const {id} = req.params;
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

  public async delete(req: Request, res: Response) {
    const {authorization} = req.headers;
    if (authorization) {
      const payload = await jwt.getPayload(authorization);
      if (payload) {
        const client = await dbController.getClient();
        try {
          await client.query(queries.removeUser.account, [payload.user_id]);
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
