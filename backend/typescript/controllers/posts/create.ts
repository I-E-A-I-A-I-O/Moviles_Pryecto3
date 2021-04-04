import {queries, jwt, dbController, queryFunctions} from '../../helpers';
import {notificationController} from '../../controllers';
import {Request, Response} from 'express';
import fse from 'fs-extra';
import {PoolClient} from 'pg';

export class PostCreation {
  public async post(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (payload) {
      const file = req.files as {[fieldname: string]: Express.Multer.File[]};
      const client = await dbController.getClient();
      try {
        await client.query(queries.transaction.begin);
        const response = await client.query(queries.post.createPost, [
          payload.user_id,
          req.body.text,
        ]);
        await this.notifyConnects(
          client,
          response.rows[0].post_id,
          payload.user_id,
          payload.name
        );
        if (!file.postMedia) {
          await client.query(queries.transaction.commit);
          res.sendStatus(201);
          return;
        }
        const path: string = `media/posts/${payload.user_id}/${response.rows[0].post_id}/${file.postMedia[0].originalname}`;
        await fse.outputFile(path, file.postMedia[0].buffer);
        await client.query(queries.post.setMedia, [
          path,
          response.rows[0].post_id,
        ]);
        await client.query(queries.transaction.commit);
        res.sendStatus(201);
      } catch (err) {
        console.error(err);
        await client.query(queries.transaction.rollback);
        res.sendStatus(500);
      } finally {
        client.release(true);
      }
    } else {
      res.sendStatus(403);
    }
  }

  private async notifyConnects(
    client: PoolClient,
    post_id: string,
    uid: string,
    name: string
  ) {
    try {
      const response = await client.query(queries.connects.get, [uid]);
      if (response.rowCount === 0) {
        return;
      }
      (async () => {
        response.rows.forEach(async user => {
          if (user.token) {
            notificationController.sendNotification(
              user.token,
              `${name} made a new post. Go check it out!`,
              'One of your connections just posted something'
            );
          }
        });
      })();
      const values = queryFunctions.generateValues(response.rowCount, 4, 2);
      const parameters = this.getParameters(response.rows, post_id);
      await client.query(
        queries.notifications.dinamic_post + values,
        parameters
      );
    } catch (err) {
      console.error(err);
    }
  }

  private getParameters(users: connects[], post_id: string): string[] {
    let params: string[] = [];
    for (let i = 0; i < users.length; i++) {
      params.push(...params, 'POST', post_id, users[i].user_id);
    }
    return params;
  }
}

type connects = {
  user_id: string;
  token: string;
  name: string;
};
