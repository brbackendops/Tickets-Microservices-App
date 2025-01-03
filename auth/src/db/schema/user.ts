import { integer, pgTable, time, timestamp, varchar } from "drizzle-orm/pg-core";

const createdAt = timestamp().defaultNow()

export const usersTable = pgTable("users",{
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    createdAt: createdAt
})