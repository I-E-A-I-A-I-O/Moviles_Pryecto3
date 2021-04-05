import fse from 'fs-extra';
import {dbController, jwt, queries} from '../../helpers';
import {Request, Response} from 'express';

type ResBody = {
  owner: string;
  text: string;
  name: string;
  uri?: string;
  mediaType?: string;
};

export class ReadPost {
  private getType(extension: string): 'video' | 'image' {
    if (
      extension === 'jpg' ||
      extension === 'jpeg' ||
      extension === 'png' ||
      extension === 'gif'
    ) {
      return 'image';
    } else {
      return 'video';
    }
  }

  public async read(req: Request, res: Response) {
    const {id} = req.params;
    const client = await dbController.getClient();
    try {
      const results = await client.query(queries.post.get, [id]);
      if (results.rowCount === 0) {
        res.sendStatus(404);
        return;
      }
      let resBody: ResBody = {
        owner: '',
        text: '',
        name: '',
      };
      resBody.text = results.rows[0].text;
      resBody.owner = results.rows[0].owner;
      resBody.name = `${results.rows[0].name} ${
        results.rows[0].last_name ?? ''
      }`;
      if (results.rows[0].media) {
        const path: string = results.rows[0].media;
        const base64String = await fse.readFile(path, {encoding: 'base64'});
        const extension = path.split('.')[1];
        const mimeType = `${this.getType(extension)}/${extension}`;
        const data = `data:${mimeType};base64,${base64String}`;
        resBody.mediaType = this.getType(extension);
        resBody.uri = data;
      }
      res.status(206).json(resBody);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    } finally {
      client.release(true);
    }
  }

  public async comments(req: Request, res: Response) {
    const {id} = req.params;
    const client = await dbController.getClient();
    try {
      const response = await client.query(queries.post.getComments, [id]);
      res.status(200).json({content: response.rows});
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    } finally {
      client.release(true);
    }
  }

  public async interactionCount(req: Request, res: Response) {
    const {id} = req.params;
    const client = await dbController.getClient();
    try {
      const likes = await client.query(queries.interactions.likes, [id]);
      const dislikes = await client.query(queries.interactions.dislikes, [id]);
      const comments = await client.query(queries.interactions.comments, [id]);
      res.status(200).json({
        likes: likes.rows[0].count,
        dislikes: dislikes.rows[0].count,
        comments: comments.rows[0].count,
      });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    } finally {
      client.release(true);
    }
  }
}
