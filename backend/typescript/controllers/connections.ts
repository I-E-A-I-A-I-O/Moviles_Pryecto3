import {dbController, jwt, queries} from '../helpers';
import {Request, Response} from 'express';
import {PoolClient} from 'pg';

export class ConnectionController {
  public async getUsersRelation(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (payload) {
      const {id} = req.params;
      try {
        const client = await dbController.getClient();
        const results = await client.query(queries.connects.requestPending, [payload.user_id, id]);
        if (results.rowCount > 0) {
            res.status(200).json({
              id: results.rows[0].id,
              status: 'Pending',
            });
            return;
        }
        const results = await client.query(queries)
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(403);
    }
  }
  
  public async createRequest(req: Request, res: Response) {

  }
}
