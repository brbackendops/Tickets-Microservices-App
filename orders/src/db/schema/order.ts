import { OrderStatus } from "@ticketsdev10/common";
import { boolean, integer , pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";


export const OrderStatusEnum = pgEnum('order_status',[OrderStatus.Created,OrderStatus.Cancelled,OrderStatus.Complete,OrderStatus.AwaitingPayment])


export const ordersTable = pgTable('orders',{
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull(),
    ticketId: integer().notNull(),
    status: OrderStatusEnum().notNull().default(OrderStatus.Created),
    expiresAt: timestamp(),
    createdAt: timestamp().defaultNow()
})