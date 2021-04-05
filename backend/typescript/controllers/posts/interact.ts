import {Request, Response} from 'express';
import {queries, dbController, jwt} from '../../helpers';
import {notificationController} from '../../controllers';
import {PoolClient} from 'pg';

type InteractionStatus = {
  like: 'ADD' | 'REMOVE';
  dislike: 'ADD' | 'REMOVE';
  like_id?: string;
  dislike_id?: string;
};

export class PostInteractions {
  private async liked(
    user_id: string,
    post_id: string,
    client: PoolClient
  ): Promise<string | null> {
    try {
      const response = await client.query(queries.interactions.liked, [
        post_id,
        user_id,
      ]);
      if (response.rowCount > 0) {
        return response.rows[0].like_id;
      } else return null;
    } catch (err) {
      return null;
    }
  }

  private async disliked(
    user_id: string,
    post_id: string,
    client: PoolClient
  ): Promise<string | null> {
    try {
      const response = await client.query(queries.interactions.disliked, [
        post_id,
        user_id,
      ]);
      if (response.rowCount > 0) {
        return response.rows[0].dislike_id;
      } else return null;
    } catch (err) {
      return null;
    }
  }

  public async currentState(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (!payload) {
      res.sendStatus(403);
      return;
    }
    const client = await dbController.getClient();
    const {id} = req.params;
    try {
      let resBody: InteractionStatus = {
        dislike: 'ADD',
        like: 'ADD',
      };
      const liked = await this.liked(payload.user_id, id, client);
      const disliked = await this.disliked(payload.user_id, id, client);
      if (liked) {
        resBody.like = 'REMOVE';
        resBody.like_id = liked;
      }
      if (disliked) {
        resBody.dislike = 'REMOVE';
        resBody.dislike_id = disliked;
      }
      res.status(200).json(resBody);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    } finally {
      client.release(true);
    }
  }

  private async notifyOwner(
    user_id: string,
    name: string,
    post_id: string,
    client: PoolClient,
    action: 'liked' | 'disliked'
  ) {
    try {
      const results = await client.query(queries.post.owner, [post_id]);
      if (results.rows[0].id === user_id) {
        return;
      }
      const token = await client.query(queries.notification_tokens.getToken, [
        results.rows[0].id,
      ]);
      if (token.rowCount > 0) {
        notificationController.sendNotification(
          token.rows[0].token,
          `${name} ${action} your post!`,
          `${name} interacted with your post. Go check it out!`
        );
      }
      await client.query(queries.notifications.post_noti, [
        action === 'liked' ? 'LIKE' : 'DISLIKE',
        post_id,
        results.rows[0].id,
      ]);
    } catch (err) {
      console.error(err);
    }
  }

  public async like(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (!payload) {
      res.sendStatus(403);
      return;
    }
    let resBody: InteractionStatus = {
      dislike: 'ADD',
      like: 'ADD',
    };
    const client = await dbController.getClient();
    const {dislike, dislike_id, like, like_id}: InteractionStatus = req.body;
    const {id} = req.params;
    try {
      await client.query(queries.transaction.begin);
      if (like === 'ADD') {
        if (dislike === 'REMOVE') {
          await client.query(queries.interactions.removeDislike, [dislike_id]);
        }
        const results = await client.query(queries.interactions.like, [
          payload.user_id,
          id,
        ]);
        resBody.like = 'REMOVE';
        resBody.like_id = results.rows[0].like_id;
        res.status(200).json(resBody);
        await this.notifyOwner(
          payload.user_id,
          payload.name,
          id,
          client,
          'liked'
        );
      } else {
        await client.query(queries.interactions.removeLike, [like_id]);
        res.status(200).json(resBody);
      }
      await client.query(queries.transaction.commit);
    } catch (err) {
      await client.query(queries.transaction.rollback);
      console.error(err);
      res.sendStatus(500);
    } finally {
      client.release(true);
    }
  }

  public async dislike(req: Request, res: Response) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization ?? '');
    if (!payload) {
      res.sendStatus(403);
      return;
    }
    let resBody: InteractionStatus = {
      dislike: 'ADD',
      like: 'ADD',
    };
    const client = await dbController.getClient();
    const {dislike, dislike_id, like, like_id}: InteractionStatus = req.body;
    const {id} = req.params;
    try {
      await client.query(queries.transaction.begin);
      if (dislike === 'ADD') {
        if (like === 'REMOVE') {
          await client.query(queries.interactions.removeLike, [like_id]);
        }
        const results = await client.query(queries.interactions.dislike, [
          payload.user_id,
          id,
        ]);
        resBody.dislike = 'REMOVE';
        resBody.dislike_id = results.rows[0].dislike_id;
        res.status(200).json(resBody);
        await this.notifyOwner(
          payload.user_id,
          payload.name,
          id,
          client,
          'disliked'
        );
      } else {
        await client.query(queries.interactions.removeDislike, [dislike_id]);
        res.status(200).json(resBody);
      }
      await client.query(queries.transaction.commit);
    } catch (err) {
      await client.query(queries.transaction.rollback);
      console.error(err);
      res.sendStatus(500);
    } finally {
      client.release(true);
    }
  }
}
