import {queries, jwt, dbController} from '../../helpers';
import {Request, Response} from 'express';
import fse from 'fs-extra';

export class PostEdition {
  public async edit(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (payload) {
      const file = req.files as {[fieldname: string]: Express.Multer.File[]};
      const client = await dbController.getClient();
      try {
        await client.query(queries.transaction.begin);
        await client.query(queries.post.set, [req.body.text, req.body.post_id]);
        if (!file.postMedia) {
          await client.query(queries.post.setMedia, [null, req.body.post_id]);
          await fse.remove(
            `media/posts/${payload.user_id}/${req.body.post_id}`
          );
          await client.query(queries.transaction.commit);
          res.sendStatus(201);
          return;
        }
        const path: string = `media/posts/${payload.user_id}/${req.body.post_id}/${file.postMedia[0].originalname}`;
        await fse.outputFile(path, file.postMedia[0].buffer);
        await client.query(queries.post.setMedia, [path, req.body.post_id]);
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

  public async delete(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (payload) {
      const client = await dbController.getClient();
      try {
        const {id} = req.params;
        await client.query(queries.post.delete, [id]);
        await fse.remove(`media/posts/${payload.user_id}/${id}`);
        res.sendStatus(200);
      } catch (err) {
        console.error(err);
        res.sendStatus(500);
      } finally {
        client.release(true);
      }
    } else {
      res.sendStatus(403);
    }
  }
}
