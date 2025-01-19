import { Listener, OrderStatus, Subject } from '@ticketsdev10/common';
import { Message } from 'node-nats-streaming';
import TicketRepo from '../../db/repo';
import db from '../../db';
import logger from '../../logger';

// order created listener for ticket

interface OrderCreatedI {
  subject: Subject.OrderCreated;
  data: {
    orderId: number;
    ticketId: number;
    userId: number;
    status: OrderStatus;
    expiresAt: string;
  };
}

export class OrderCreatedListener extends Listener<OrderCreatedI> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
  queueGroupName: string = 'order-created-listener-for-tickets';

  onMessage(
    data: {
      orderId: number;
      ticketId: number;
      userId: number;
      status: OrderStatus;
      expiresAt: string;
    },
    msg: Message,
  ): void {
    const ticketsRepo = new TicketRepo(db);
    ticketsRepo
      .updateLock(data.ticketId, true)
      .then(() => {
        logger.info('ticket locked successfully based on lock');
        msg.ack();
        logger.info('successfully received event from orders service');
      })
      .catch(err => {
        logger.error('order created event listener ends in error');
        console.log(err);
      });
  }
}

// order cancelled listener for ticket

interface OrderCancelledI {
  subject: Subject.OrderCancelled;
  data: {
    orderId: number;
    ticketId: number;
    userId: number;
    status: OrderStatus;
  };
}

export class OrderCancelledListener extends Listener<OrderCancelledI> {
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
  queueGroupName: string = 'order-cancelled-listener-for-tickets';

  onMessage(
    data: {
      orderId: number;
      ticketId: number;
      userId: number;
      status: OrderStatus;
    },
    msg: Message,
  ): void {
    const ticketsRepo = new TicketRepo(db);
    ticketsRepo
      .updateLock(data.ticketId, false)
      .then(() => {
        logger.info('ticket locked successfully based on lock');
        msg.ack();
        logger.info('successfully received event from orders service');
      })
      .catch(err => {
        logger.error('order created event listener ends in error');
        console.log(err);
      });
  }
}

// order completion listener for ticket
interface OrderCompletionData {
  subject: Subject.OrderComplete;
  data: {
    ticketId: number;
  };
}

export class OrderCompletionListenter extends Listener<OrderCompletionData> {
  subject: Subject.OrderComplete = Subject.OrderComplete;
  queueGroupName: string = 'complete-status-for-tickets';

  onMessage(data: { ticketId: number }, msg: Message): void {
    const ticketsRepo = new TicketRepo(db);

    logger.info(
      'order for making complete status is recieved in tickets service from payment service',
    );
    ticketsRepo
      .updateLock(data.ticketId, false)
      .then(() => {
        logger.info('order is updated to complete status in order service');
        msg.ack();
      })
      .catch(err => {
        logger.error(
          `error-order-complete: error in completing order in order service ${err}`,
        );
      });

    logger.info(
      'new order is successfully updated to complete from payment service',
    );
  }
}
