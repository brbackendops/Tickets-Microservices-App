import { boolean, integer, pgTable, serial, timestamp, varchar , decimal } from "drizzle-orm/pg-core";


export const ticketsTable = pgTable('tickets',{
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    ticketId: integer().notNull(),
    title: varchar({ length: 255 }).notNull(),
    price: decimal().default("0.00").notNull(),
});

