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
      res.status(200).json({
        text: results.rows[0].text,
        owner: results.rows[0].owner,
        name: `${results.rows[0].name} ${results.rows[0].last_name ?? ''}`,
      });
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

  public async postMedia(req: Request, res: Response) {
    const {id} = req.params;
    const client = await dbController.getClient();
    try {
      const results = await client.query(queries.post.getMedia, [id]);
      if (results.rowCount === 0) {
        return res.sendStatus(404);
      }
      const path: string = results.rows[0].media;
      const extension = path.split('.')[1];
      const mimeType = `${this.getType(extension)}/${extension}`;
      fse.stat(path, (err, stats) => {
        if (err) {
          if (err.code === 'ENOENT') {
            return res.sendStatus(404);
          }
          return res.sendStatus(500);
        }
        let range = req.headers.range;
        if (!range) {
          return res.sendStatus(416);
        }
        let positions = range.replace(/bytes=/, '').split('-');
        let start = parseInt(positions[0], 10);
        let file_size = stats.size;
        let end = positions[1] ? parseInt(positions[1], 10) : file_size - 1;
        let chunk_size = start - end + 1;
        if (start > end) {
          return res.sendStatus(416);
        }
        let head = {
          'Content-Range': `bytes ${start}-${end}/${file_size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunk_size,
          'Content-Type': mimeType,
        };
        res.writeHead(206, undefined, head);
        let stream = fse.createReadStream(path, {start: start, end: end});
        stream.on('open', () => {
          stream.pipe(res);
        });
        stream.on('error', error => {
          console.error(error);
          return res.sendStatus(500);
        });
      });
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
