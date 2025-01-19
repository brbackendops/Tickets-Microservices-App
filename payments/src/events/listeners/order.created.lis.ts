import { Listener, OrderStatus, Subject } from '@ticketsdev10/common';
import { Message } from 'node-nats-streaming';
import db from '../../db';
import { OrdersRepo } from '../../db/repo/orders.repo';
import logger from '../../logger';

interface OrderCancelledEvent {
  subject: Subject.OrderCreated;
  data: {
    orderId: number;
    ticketId: number;
    version: number;
    userId: number;
    status: OrderStatus | undefined;
    price: string;
  };
}

export class OrderCreatedListener extends Listener<OrderCancelledEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
  queueGroupName: string = 'order.created.for.payments';

  onMessage(
    data: {
      orderId: number;
      version: number;
      ticketId: number;
      userId: number;
      status: OrderStatus;
      price: string;
    },
    msg: Message,
  ): void {
    try {
      const ordersRepo = new OrdersRepo(db);

      ordersRepo
        .update(data?.orderId, data)
        .then(() => {
          logger.info(
            'order created from event order:created in payments successfully',
          );
          msg.ack();
        })
        .catch(error => {
          logger.info(
            `order failed to created from event order:created in payments : ${error}`,
          );
          throw error;
        });
    } catch (error) {
      throw error;
    }
  }
}
