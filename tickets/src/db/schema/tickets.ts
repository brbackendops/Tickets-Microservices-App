import { sql } from 'drizzle-orm';
import { pgTable , integer, varchar, decimal, timestamp, interval, boolean } from 'drizzle-orm/pg-core';


// title , price , userId , createdAt

export const ticketsTable = pgTable('tickets', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 200 }).notNull(),
    price: decimal().default("0.00").notNull(),
    version: integer().notNull().default(sql`nextval('ticket_version_seq')`),
    userId: integer().notNull(),
    lock: boolean().notNull().default(false),
    createdAt: timestamp().defaultNow()
})