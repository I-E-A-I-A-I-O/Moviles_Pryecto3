import {Request, Response} from 'express';
import {dbController, queries, jwt} from '../helpers';
import {BasicCRUD} from './controllers_defs/CRUD';
import fse from 'fs-extra';
import bcrypt from 'bcrypt';
import {PoolClient} from 'pg';

export class UserController extends BasicCRUD {
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

  private async readAvatar(req: Request, res: Response) {
    const {id} = req.params;
    const client = await dbController.getClient();
    try {
      const results = await client.query(queries.getUser.avatar, [id]);
      if (results.rowCount > 0) {
        const path: string = results.rows[0].avatar;
        const base64String = await fse.readFile(path, {encoding: 'base64'});
        const type = path.split('.')[1];
        const mimeType = `image/${type}`;
        const data = `data:${mimeType};base64,${base64String}`;
        res.status(200).send(data);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      console.error(err);
      res.sendStatus(503);
    } finally {
      client.release(true);
    }
  }

  private async readProfile(req: Request, res: Response) {
    const {id} = req.params;
    const {authorization} = req.headers;
    if (authorization) {
      const payload = await jwt.getPayload(authorization);
      if (payload) {
        const client = await dbController.getClient();
        try {
          const name = await client.query(queries.getUser.name, [id]);
          const abilites = await client.query(queries.getUser.abilites, [id]);
          const awards = await client.query(queries.getUser.awards, [id]);
          const titles = await client.query(queries.getUser.titles, [id]);
          const experience = await client.query(queries.getUser.experience, [
            id,
          ]);
          const projects = await client.query(queries.getUser.projects, [id]);
          const recommendations = await client.query(
            queries.getUser.recommendations,
            [id]
          );
          const description = await client.query(queries.getUser.description, [
            id,
          ]);
          const resBody = {
            name: name.rows[0].name,
            abilities: abilites.rows,
            awards: awards.rows,
            experience: experience.rows,
            projects: projects.rows,
            recommendations: recommendations.rows,
            description: description.rows[0] ?? undefined,
            education: titles.rows,
          };
          res.status(200).json(resBody);
        } catch (err) {
          console.error(err);
          res.status(503).json({
            title: 'error',
            content: 'Error retrieving iformation',
          });
        } finally {
          client.release(true);
        }
      } else {
        res.status(403).json({
          title: 'error',
          content: 'invalid token',
        });
      }
    } else {
      res.status(403).json({
        title: 'error',
        content: 'missing token',
      });
    }
  }

  public read(req: Request, res: Response, target: string) {
    switch (target) {
      case 'avatar': {
        this.readAvatar(req, res);
        break;
      }
      case 'profile': {
        this.readProfile(req, res);
        break;
      }
      default: {
        res.sendStatus(404);
        break;
      }
    }
  }

  public async updateAvatar(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (payload) {
      try {
        const files = req.files as {[fieldname: string]: Express.Multer.File[]};
        const absolutePath = `media/avatars/${payload.user_id}/${files.avatar[0].originalname}`;
        await fse.outputFile(absolutePath, files.avatar[0].buffer);
        res.status(200).json({
          title: 'success',
          content: 'Avatar updated!',
        });
      } catch (err) {
        res.status(500).json({
          title: 'error',
          content: 'Could not update the avatar.',
        });
      }
    } else {
      res.sendStatus(403);
    }
  }

  private async duplicateCredentials(
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

  public async updatePhone(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (payload) {
      const client = await dbController.getClient();
      const {phone} = req.body;
      try {
        const duplicate = await this.duplicateCredentials(
          client,
          'phone',
          undefined,
          phone
        );
        if (duplicate) {
          res.status(400).json({
            content: 'Phone already registered.',
          });
        } else {
          await client.query(queries.setUser.phone, [phone, payload.user_id]);
          res.status(200).json({
            content: 'Phone updated!',
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({
          content: 'Error updating the phone. Try again later.',
        });
      } finally {
        client.release(true);
      }
    } else {
      res.sendStatus(403);
    }
  }

  public async updateEmail(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (payload) {
      const client = await dbController.getClient();
      const {email} = req.body;
      try {
        const duplicate = await this.duplicateCredentials(
          client,
          'email',
          email
        );
        if (duplicate) {
          res.status(400).json({
            content: 'Email already registered.',
          });
        } else {
          await client.query(queries.setUser.email, [email, payload.user_id]);
          res.status(200).json({
            content: 'Email updated!',
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({
          content: 'Error updating the email. Try again later.',
        });
      } finally {
        client.release(true);
      }
    } else {
      res.sendStatus(403);
    }
  }

  public async updatePassword(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (payload) {
      const {newPass} = req.body;
      const client = await dbController.getClient();
      try {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(newPass, salt);
        await client.query(queries.setUser.passwordWithID, [
          hash,
          payload.user_id,
        ]);
        res.status(200).json({
          content: 'Profile updated. Signing out.',
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          content: 'Error updating the account. Try again later.',
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

  public update(req: Request, res: Response) {}

  public async updateName(req: Request, res: Response) {
    const {authorization} = req.headers;
    if (authorization) {
      const payload = await jwt.getPayload(authorization);
      if (payload) {
        const client = await dbController.getClient();
        try {
          await client.query(queries.setUser.name, [
            req.body.name,
            payload.user_id,
          ]);
          res.status(201).json({
            title: 'success',
            content: 'Profile updated!',
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

  public async delete(req: Request, res: Response) {
    const {authorization} = req.headers;
    if (authorization) {
      const payload = await jwt.getPayload(authorization);
      if (payload) {
        const client = await dbController.getClient();
        try {
          await client.query(queries.removeUser.account, [payload.user_id]);
          res.sendStatus(200);
        } catch (err) {
          console.error(err);
          res.status(500).json({
            title: 'error',
            content: 'Error updating the profile',
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
