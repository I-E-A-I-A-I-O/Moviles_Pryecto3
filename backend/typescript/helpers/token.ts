import jwt from "jsonwebtoken";
import query from "./queries";
import { dbController as database } from "./";
import { TokenControllerObject } from "./helperTypes/tokenTypes";

import type { TokenPayload } from "./helperTypes/tokenTypes";

export class TokenController extends TokenControllerObject {
  async invalidToken(token: string): Promise<boolean> {
    let client = await database.getClient();
    try {
      let results = await client.query(query.jwt.isValid, [token]);
      if (results.rowCount < 1) {
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      return true;
    } finally {
      client.release(true);
    }
  }

  async getPayload(token: string): Promise<TokenPayload | null> {
    if (!process.env.SECRET_JWT) {
      return null;
    } else {
      let invalid = await this.invalidToken(token);
      if (invalid) {
        return null;
      } else {
        try {
          const verified = jwt.verify(token, process.env.SECRET_JWT);
          return verified as TokenPayload;
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    }
  }

  async invalidateToken(token: string): Promise<boolean> {
    let client = await database.getClient();
    try {
      await client.query(query.jwt.invalidate, [token]);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      client.release(true);
    }
  }
}
