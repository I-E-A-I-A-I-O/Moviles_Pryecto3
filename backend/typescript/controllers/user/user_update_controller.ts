import {Request, Response} from 'express';
import {dbController, queries, jwt} from '../../helpers';
import bcrypt from 'bcrypt';
import fse from 'fs-extra';
import {userAuth} from '../../controllers';

export class UpdateUserDescription {
  public async updateGeneral(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (payload) {
      const {
        last_name,
        age,
        gender,
        description,
        country,
        address,
        b_date,
      } = req.body;
      const client = await dbController.getClient();
      try {
        const results = await client.query(queries.setUser.description, [
          description,
          country,
          age,
          gender,
          address,
          last_name,
          b_date,
          payload.user_id,
        ]);
        if (results.rowCount > 0) {
          res.status(201).json({
            title: 'success',
            content: 'Profile updated',
          });
        } else {
          await client.query(queries.insertUser.description, [
            payload.user_id,
            last_name,
            gender,
            address,
            country,
            age,
            description,
            b_date,
          ]);
          res.status(200).json({
            title: 'success',
            content: 'Profile updated',
          });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({
          title: 'error',
          content: 'Could not update general information.',
        });
      } finally {
        client.release(true);
      }
    } else {
      res.sendStatus(403);
    }
  }

  public async update(
    req: Request,
    res: Response,
    query: string,
    params: string[]
  ) {
    const {authorization} = req.headers;
    if (authorization) {
      const payload = await jwt.getPayload(authorization);
      if (payload) {
        const client = await dbController.getClient();
        try {
          await client.query(query, params);
          res.status(200).json({
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

  public async updatePhone(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (payload) {
      const client = await dbController.getClient();
      const {phone} = req.body;
      try {
        const duplicate = await userAuth.duplicateCredentials(
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
        const duplicate = await userAuth.duplicateCredentials(
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
}
