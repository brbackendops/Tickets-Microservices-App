import { OrderStatus } from '@ticketsdev10/common';
import { decimal, integer, pgEnum, pgTable } from 'drizzle-orm/pg-core';

export const OrderStatusEnum = pgEnum('order_status',[OrderStatus.Created,OrderStatus.Cancelled,OrderStatus.Complete,OrderStatus.AwaitingPayment,OrderStatus.ChargeCreated])

export const ordersTable = pgTable('orders', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(), 
    orderId: integer().notNull(), 
    ticketId: integer().notNull(), 
    version: integer().notNull(), 
    userId: integer().notNull(), 
    status: OrderStatusEnum().notNull().default(OrderStatus.Created), 
    price: decimal().notNull() 
})