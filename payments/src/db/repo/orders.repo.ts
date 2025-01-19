import { drizzle } from 'drizzle-orm/node-postgres';
import { ordersTable, OrderStatusEnum } from '../schema/orders';
import { OrderStatus } from '@ticketsdev10/common';
import {
  ColumnBaseConfig,
  ColumnDataType,
  eq,
  Placeholder,
  SQL,
} from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';

interface OrdersPayload {
  orderId: number;
  ticketId: number;
  version: number;
  userId: number;
  price: string;
  status:
    | OrderStatus.Created
    | OrderStatus.Complete
    | OrderStatus.Cancelled
    | OrderStatus.AwaitingPayment
    | OrderStatus.ChargeCreated
    | SQL<unknown>
    | Placeholder<string, any>
    | undefined;
}

interface OrdersUpdatePayload {
  orderId: number;
  ticketId: number;
  version: number;
  userId: number;
  price: string;
  status:
    | OrderStatus.Created
    | OrderStatus.Complete
    | OrderStatus.Cancelled
    | OrderStatus.AwaitingPayment
    | OrderStatus.ChargeCreated
    | SQL<unknown>
    | PgColumn<ColumnBaseConfig<ColumnDataType, string>, {}, {}>
    | undefined;
}

export class OrdersRepo {
  private DB: ReturnType<typeof drizzle>;

  constructor(db: ReturnType<typeof drizzle>) {
    this.DB = db;
  }

  async create(payload: OrdersPayload): Promise<void> {
    try {
      await this.DB.insert(ordersTable).values(payload);
    } catch (error) {
      throw error;
    }
  }

  async update(orderId: number, payload: OrdersUpdatePayload): Promise<void> {
    try {
      await this.DB.update(ordersTable)
        .set(payload)
        .where(eq(ordersTable.id, orderId));
    } catch (error) {
      throw error;
    }
  }

  async findOne(orderId: number): Promise<OrdersPayload | null> {
    try {
      const order = await this.DB.select()
        .from(ordersTable)
        .where(eq(ordersTable.orderId, orderId));

      return order.length > 0 ? order[0] : null;
    } catch (error) {
      throw error;
    }
  }
}
