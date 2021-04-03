import {Request, Response} from 'express';
import {dbController, queries} from '../helpers';

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
}
