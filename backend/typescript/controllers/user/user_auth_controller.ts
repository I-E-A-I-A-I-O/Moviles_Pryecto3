import {Request, Response} from 'express';
import {dbController, queries, jwt} from '../../helpers';
import bcrypt from 'bcrypt';
import {PoolClient} from 'pg';

export class UserAuthentication {
  public async duplicateCredentials(
    client: PoolClient,
    type: 'phone' | 'email',
    email?: string,
    phone?: string
  ): Promise<boolean> {
    try {
      let query: string;
      let params: string[] = [];
      if (type === 'phone') {
        if (!phone) {
          return true;
        }
        query = queries.getUser.phones;
        params.push(phone);
      } else {
        if (!email) {
          return true;
        }
        query = queries.getUser.emails;
        params.push(email);
      }
      const response = await client.query(query, params);
      return response.rowCount > 0;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public async verifyPassword(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (payload) {
      const client = await dbController.getClient();
      const {password} = req.body;
      try {
        const response = await client.query(queries.getUser.password, [
          payload.user_id,
        ]);
        const same = await bcrypt.compare(password, response.rows[0].password);
        if (same) {
          res.sendStatus(200);
        } else {
          res.status(403).json({
            content: 'Wrong password.',
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({
          content: 'Error verifying the password. Try again later.',
        });
      } finally {
        client.release(true);
      }
    } else {
      res.sendStatus(403);
    }
  }

  public async passwordRecovery(req: Request, res: Response) {
    const client = await dbController.getClient();
    const {email, password} = req.body;
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      await client.query(queries.setUser.passwordWithEmail, [hash, email]);
      res.status(200).json({
        content: 'Password updated.',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        content: 'Error updating the password. Try again later.',
      });
    } finally {
      client.release(true);
    }
  }
}
