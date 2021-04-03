import {Request, Response} from 'express';
import {dbController, queries, jwt} from '../../helpers';
import fse from 'fs-extra';
import bcrypt from 'bcrypt';

export class UserCreateController {
  public async create(req: Request, res: Response) {
    const files = req.files as {[fieldname: string]: Express.Multer.File[]};
    const {name, email, phone, password} = req.body;
    const client = await dbController.getClient();
    try {
      await client.query(queries.transaction.begin);
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      let results = await client.query(queries.insertUser.new, [
        name,
        email,
        phone,
        hash,
      ]);
      const user_id: string = results.rows[0].user_id;
      if (!files.avatar) {
        await client.query(queries.transaction.commit);
        res.status(201).json({
          title: 'success',
          content: 'Account registered!',
        });
      } else {
        const absolutePath = `media/avatars/${user_id}/${files.avatar[0].originalname}`;
        await fse.outputFile(absolutePath, files.avatar[0].buffer);
        await client.query(queries.setUser.avatar, [absolutePath, user_id]);
        await client.query(queries.transaction.commit);
        res.status(201).json({
          title: 'success',
          content: 'Account registered!',
        });
      }
    } catch (err) {
      console.error(err);
      await client.query(queries.transaction.rollback);
      res.status(503).json({
        title: 'error',
        content: 'Could not complete the registration.',
      });
    } finally {
      client.release(true);
    }
  }

  public async addDescription(
    req: Request,
    res: Response,
    query: string,
    params: string[],
    ability?: boolean
  ) {
    const {authorization} = req.headers;
    if (authorization) {
      const payload = await jwt.getPayload(authorization);
      if (payload) {
        const client = await dbController.getClient();
        try {
          const results = await client.query(query, [
            payload.user_id,
            ...params,
          ]);
          res.status(201).json({
            title: 'success',
            content: ability ? results.rows[0] : 'Profile updated!',
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
}
