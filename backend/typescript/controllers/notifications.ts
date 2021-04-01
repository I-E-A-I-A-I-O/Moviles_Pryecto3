import admin from 'firebase-admin';
import {Request, Response} from 'express';
import {queries, dbController, jwt} from '../helpers';

export class NotificationController {
  public async registerToken(req: Request, res: Response) {
    const {authorization} = req.headers;
    if (!authorization) {
      res.sendStatus(401);
    } else {
      const payload = await jwt.getPayload(authorization);
      if (!payload) {
        res.sendStatus(403);
      } else {
        const {token} = req.body;
        const client = await dbController.getClient();
        try {
          const results = await client.query(
            queries.notification_tokens.updateToken,
            [token, payload.user_id]
          );
          if (results.rowCount < 1) {
            await client.query(queries.notification_tokens.register, [
              payload.user_id,
              token,
            ]);
          }
          res.sendStatus(200);
        } catch (err) {
          console.error(err);
          res.sendStatus(500);
        }
      }
    }
  }

  public async sendNotification(target: string, title: string, body?: string) {
    await admin.messaging().sendToDevice(
      [target],
      {
        notification: {
          title: title,
          body: body,
          sound: 'default',
        },
      },
      {
        priority: 'high',
      }
    );
  }
}
