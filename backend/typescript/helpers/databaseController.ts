import pg, { Pool, PoolClient } from "pg";

export class DBController {
  private pool: Pool;

  constructor() {
    this.pool = new pg.Pool({
      connectionString: process.env.DBCONNECTION_STRING,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 20,
      min: 1,
      connectionTimeoutMillis: 20000,
    });
    this.pool.on("error", (err, client) => {
      console.error(err);
    });
  }

  public getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }
}
