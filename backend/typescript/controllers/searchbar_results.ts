import {dbController, queries, jwt} from '../helpers';
import {Request, Response} from 'express';

export class SearchBarResults {
  public async searchPeople(req: Request, res: Response) {
    const payload = req.headers.authorization
      ? await jwt.getPayload(req.headers.authorization)
      : null;
    if (!payload) {
      res.status(400).json({
        title: 'error',
        content: 'Token missing',
      });
      return;
    } else {
      let query: string;
      let params: string[] = [];
      const {scope, search} = req.params;
      if (scope === 'global') {
        query = queries.search.users;
        params.push(search);
      } else if (scope === 'connections') {
        query = queries.search.connectedUsers;
        params.push(search, payload.user_id);
      } else {
        res.sendStatus(404);
        return;
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

  public async searchPosts(req: Request, res: Response) {
    const payload = req.headers.authorization
      ? await jwt.getPayload(req.headers.authorization)
      : null;
    if (!payload) {
      res.status(400).json({
        title: 'error',
        content: 'Token missing',
      });
      return;
    } else {
      let query: string;
      let params: string[] = [];
      const {scope} = req.params;
      if (scope === 'global') {
        query = queries.search.postsAll;
        params.push(payload.user_id);
      } else if (scope === 'connections') {
        query = queries.search.postsConnected;
        params.push(payload.user_id);
      } else {
        res.sendStatus(404);
        return;
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

  public async searchPostsMatch(req: Request, res: Response) {
    const payload = req.headers.authorization
      ? await jwt.getPayload(req.headers.authorization)
      : null;
    if (!payload) {
      res.status(400).json({
        title: 'error',
        content: 'Token missing',
      });
      return;
    } else {
      let query: string;
      let params: string[] = [];
      const {scope, search} = req.params;
      if (scope === 'global') {
        query = queries.search.postsMatch;
        params.push(search);
      } else if (scope === 'connections') {
        query = queries.search.postsConnectedMatch;
        params.push(payload.user_id, search);
      } else {
        res.sendStatus(404);
        return;
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
}
