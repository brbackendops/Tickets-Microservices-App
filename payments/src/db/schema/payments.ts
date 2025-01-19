import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const paymentsTable = pgTable('payments', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer().notNull(),
  stripeId: varchar({ length: 255 }).notNull(),
});
