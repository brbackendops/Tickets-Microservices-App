import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL! ||
    `postgresql://${process.env.POSTGRES_USERNAME}:${process.env.POSTGRES_PASSWORD}@tickets-db-srv.tickets-app:5432/${process.env.POSTGRES_DB}`,
});

const db = drizzle(pool);

export default db;
