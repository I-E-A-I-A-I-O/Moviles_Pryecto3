import {Request, Response} from 'express';
import {PoolClient} from 'pg';
import {dbController, queries, getRandomInt, mailer} from '../helpers';
import {CodeCRUD} from './controllers_defs/CRUD';

type ExistentCodes = {
  code: string;
};

export class CodeController extends CodeCRUD {
  private generateCode(existentCodes: ExistentCodes[]): string {
    const data =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += data[getRandomInt(data.length)];
    }
    for (let i = 0; i < existentCodes.length; i++) {
      if (existentCodes[i].code === code) {
        return this.generateCode(existentCodes);
      }
    }
    return code;
  }

  private async verifyNew(
    email: string,
    phone: string,
    client: PoolClient
  ): Promise<boolean> {
    try {
      let results = await client.query(queries.getUser.areCredentialsNew, [
        email,
        phone,
      ]);
      return results.rowCount === 0;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  private async verifyRecover(
    email: string,
    client: PoolClient
  ): Promise<boolean> {
    try {
      let results = await client.query(queries.getUser.credentials, [email]);
      return results.rowCount > 0;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  private async verify(
    email: string,
    type: 'new' | 'recovery',
    client: PoolClient,
    phone?: string
  ): Promise<boolean> {
    switch (type) {
      case 'new': {
        if (!phone) {
          return false;
        } else {
          return this.verifyNew(email, phone, client);
        }
      }
      case 'recovery': {
        return this.verifyRecover(email, client);
      }
      default: {
        return false;
      }
    }
  }

  public async create(req: Request, res: Response) {
    const {name, email, phone, verification} = req.body;
    const client = await dbController.getClient();
    try {
      const valid = await this.verify(email, verification, client, phone);
      if (!valid) {
        res.status(401).json({
          title: 'error',
          content:
            verification === 'new'
              ? 'Email or phone number already in use!'
              : verification === 'recovery'
              ? 'Email not found.'
              : 'Invalid data received!',
        });
      } else {
        let results = await client.query(
          queries.verification_codes.getExistentCodes,
          ['PENDING']
        );
        const authCode = this.generateCode(results.rows);
        results = await client.query(queries.verification_codes.insertNewCode, [
          email,
          authCode,
          'PENDING',
        ]);
        res.status(201).json({
          title: 'success',
          content: results.rows[0].verification_id,
        });
        mailer.sendCode(name, email, authCode);
        setTimeout(
          (id: string) => {
            this.delete(id);
          },
          300000,
          results.rows[0].verification_id
        );
      }
    } catch (err) {
      res.status(503).json({
        title: 'error',
        content: 'Could not complete registration. Try again later.',
      });
      console.error(err);
    } finally {
      client.release(true);
    }
  }

  public async update(req: Request, res: Response) {
    await this.delete(req.body.verification_id);
    this.create(req, res);
  }

  protected async delete(verification_id: string) {
    const client = await dbController.getClient();
    try {
      await client.query(queries.verification_codes.invalidateCode, [
        verification_id,
      ]);
      console.info(
        `Verification code with ID ${verification_id} expired at ${new Date(
          Date.now()
        ).toISOString()}.`
      );
    } catch (err) {
      console.error(err);
    } finally {
      client.release(true);
    }
  }

  public async read(req: Request, res: Response) {
    const {verification_id, code} = req.body;
    const client = await dbController.getClient();
    try {
      let results = await client.query(queries.verification_codes.verifyCode, [
        verification_id,
        code,
        'PENDING',
      ]);
      if (results.rowCount > 0) {
        await client.query(queries.verification_codes.setCompleted, [
          'COMPLETED',
          verification_id,
        ]);
        res.sendStatus(204);
      } else {
        res.status(404).json({
          title: 'error',
          content: 'Invalid code',
        });
      }
    } catch (err) {
      console.error(err);
      res.status(503).json({
        title: 'error',
        content: 'Could not verify code',
      });
    } finally {
      client.release(true);
    }
  }
}
