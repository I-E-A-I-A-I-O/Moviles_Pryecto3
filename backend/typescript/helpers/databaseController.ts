import pg, { Pool, PoolClient } from 'pg';

export class DBController {

    private pool: Pool;

    constructor() {
        this.pool = new pg.Pool({
            connectionString: process.env.DBCONNECTION_STRING,
            ssl: {
                rejectUnauthorized: false
            },
            max: 20,
            idleTimeoutMillis: 3000,
        });
    }

    public getClient(): Promise<PoolClient> {
        return this.pool.connect();
    }
}