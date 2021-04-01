import {dbController, jwt, queries} from '../helpers';
import {Request, Response} from 'express';
import {notificationController} from '.';
export class ConnectionController {
  public async getUsersRelation(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (payload) {
      const {id} = req.params;
      const client = await dbController.getClient();
      try {
        let results = await client.query(queries.connects.requestPending, [
          payload.user_id,
          id,
        ]);
        if (results.rowCount > 0) {
          res.status(200).json({
            id: results.rows[0].id,
            status: 'Pending',
          });
        } else {
          results = await client.query(queries.connects.requestPending, [
            id,
            payload.user_id,
          ]);
          if (results.rowCount > 0) {
            res.status(200).json({
              id: results.rows[0].id,
              status: 'Accept',
            });
          } else {
            results = await client.query(queries.connects.connected, [
              payload.user_id,
              id,
            ]);
            if (results.rowCount > 0) {
              res.status(200).json({
                id: results.rows[0].id,
                status: 'Disconnect',
              });
            } else {
              res.status(200).json({
                status: 'Connect',
                id: undefined,
              });
            }
          }
        }
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      } finally {
        client.release(true);
      }
    } else {
      res.sendStatus(403);
    }
  }

  public async createRequest(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (payload) {
      const client = await dbController.getClient();
      const {id} = req.body;
      try {
        await client.query(queries.transaction.begin);
        const response = await client.query(queries.connects.request, [
          payload.user_id,
          id,
        ]);
        await client.query(queries.notifications.connect_noti, [
          'REQUEST',
          response.rows[0].id,
        ]);
        const targetToken = await client.query(
          queries.notification_tokens.getToken,
          [id]
        );
        await client.query(queries.transaction.commit);
        notificationController.sendNotification(
          targetToken.rows[0].token,
          'Connection request',
          `You received a new connection request. ${payload.name} Wants to connect with you!`
        );
        res.status(200).json({
          id: response.rows[0].id,
        });
      } catch (err) {
        await client.query(queries.transaction.rollback);
        console.error(err);
        res.sendStatus(503);
      } finally {
        client.release(true);
      }
    } else {
      res.sendStatus(403);
    }
  }

  public async deleteConnection(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (payload) {
      const client = await dbController.getClient();
      const {id} = req.params;
      try {
        await client.query(queries.transaction.begin);
        await client.query(queries.connects.disconnect, [id, payload.user_id]);
        await client.query(queries.connects.disconnect, [payload.user_id, id]);
        await client.query(queries.transaction.commit);
        res.sendStatus(200);
      } catch (err) {
        await client.query(queries.transaction.rollback);
        console.error(err);
        res.sendStatus(503);
      } finally {
        client.release(true);
      }
    } else {
      res.sendStatus(403);
    }
  }

  public async deleteRequest(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (payload) {
      const client = await dbController.getClient();
      const {id} = req.params;
      try {
        await client.query(queries.connects.deleteRequest, [id]);
        res.sendStatus(200);
      } catch (err) {
        console.error(err);
        res.sendStatus(503);
      } finally {
        client.release(true);
      }
    } else {
      res.sendStatus(403);
    }
  }

  public async createConnection(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (payload) {
      const client = await dbController.getClient();
      const {user_id, request_id} = req.body;
      try {
        await client.query(queries.transaction.begin);
        const response = await client.query(queries.connects.connect, [
          payload.user_id,
          user_id,
        ]);
        await client.query(queries.connects.connect, [
          user_id,
          payload.user_id,
        ]);
        await client.query(queries.connects.deleteRequest, [request_id]);
        await client.query(queries.transaction.commit);
        res.status(200).json({
          id: response.rows[0].id,
        });
      } catch (err) {
        await client.query(queries.transaction.rollback);
        console.error(err);
        res.sendStatus(503);
      } finally {
        client.release(true);
      }
    } else {
      res.sendStatus(403);
    }
  }
}
