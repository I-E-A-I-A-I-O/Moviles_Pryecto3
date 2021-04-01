import {dbController, queries, jwt} from '../helpers';
import {Request, Response} from 'express';

export class SearchBarResults {
  public async search(req: Request, res: Response, type: string) {
    let query: string;
    let params: string[] = [];
    const payload = req.headers.authorization
      ? await jwt.getPayload(req.headers.authorization)
      : null;
    const {scope, search} = req.params;
    switch (type) {
      case 'people': {
        if (scope === 'global') {
          query = queries.search.users;
          params.push(search);
          break;
        } else {
          if (!payload) {
            res.status(400).json({
              title: 'error',
              content: 'Token missing',
            });
            return;
          } else {
            res.sendStatus(500);
            return;
          }
        }
      }
      default: {
        res.sendStatus(404);
        return;
      }
    }
    const client = await dbController.getClient();
    try {
      const response = await client.query(query, params);
      console.log(JSON.stringify(response));
      res.status(200).json({
        title: 'success',
        content: response.rows,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        content: [],
      });
    } finally {
      client.release(true);
    }
  }
}
