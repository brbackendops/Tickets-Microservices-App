import { Listener, OrderStatus, Subject } from "@ticketsdev10/common";
import { Message } from "node-nats-streaming";
import db from "../../db";
import { ticketsTable } from "../../db/schema/tickets";
import logger from "../../logger";
import { eq } from "drizzle-orm";
import { TicketRepo } from "../../db/repo/ticket.repo";
import { OrdersRepo } from "../../db/repo/orders.repo";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledPublisher } from "../publish/publish.types";


// ticket created listener from ticket service

interface TicketCreateData {
    subject: Subject.TicketCreated,
    data: {
        id: number;
        title: string;
        price: string;
    }
}



export class TicketCreateListener extends Listener<TicketCreateData> {

    subject: Subject.TicketCreated = Subject.TicketCreated;
    queueGroupName: string = 'ticket-created-for-orders';

    onMessage(data: { id: number; title: string; price: string; }, msg: Message): void {
        const ticketRepo = new TicketRepo(db)
        const ticketData = {
            ticketId: data.id,
            title: data.title,
            price: data.price
        }
        logger.info("new ticket is recieved in order service")
        
        ticketRepo.create(ticketData)
            .then(() => {
                logger.info("new ticket is created in order service");
                msg.ack();
            })
            .catch((err) => {
                logger.error(`error-ticket-order: error in creating ticket in order service ${err}`)
            });
        
        logger.info("new ticket is successfully created in order service");
    }
}

// ticket updated listener from ticket service

interface TicketUpdateData {
    subject: Subject.TickerUpdated,
    data: {
        id: number;
        title: string;
        price: string;
    }
}

export class TicketUpdateListenter extends Listener<TicketUpdateData> {
    subject: Subject.TickerUpdated = Subject.TickerUpdated;
    queueGroupName: string = "ticket-updated-for-orders";

    onMessage(data: { id: number; title: string; price: string; }, msg: Message): void {
        const ticketRepo = new TicketRepo(db)
        const ticketData = {
            title: data.title,
            price: data.price
        }
        logger.info("ticket for update is recieved in order service from ticket service")

        ticketRepo.update(ticketData,data.id)
            .then(() => {
                logger.info("ticket is updated in order service");
                msg.ack();
            })
            .catch((err) => {
                logger.error(`error-ticket-update-order: error in updating ticket in order service ${err}`)
            });
        
        logger.info("new ticket is successfully updated in order service");
    }

}


// order cancel listener from expiration service

interface OrderExpirationData {
    subject: Subject.ExpirationComplete,
    data: {
        orderId: number;
    }
}

export class OrderExpirationListenter extends Listener<OrderExpirationData> {
    subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
    queueGroupName: string = "expiration-for-orders";

    async onMessage(data: { orderId: number; }, msg: Message): Promise<void> {
        const orderRepo = new OrdersRepo(db)

        
        logger.info("order for cancellation is recieved in order service from expiration service")
        const orderData = await orderRepo.findOneOrder(data.orderId)

        orderRepo.updateStatusToCancel(data.orderId)
            .then(() => {

                logger.info("ticket is cancelled in order service");
                new OrderCancelledPublisher(natsWrapper.client).publish({
                    orderId: orderData?.id!,
                    ticketId: orderData?.ticketId!,
                    userId: orderData?.userId!,
                    status: OrderStatus.Cancelled
                });

                logger.info(`order with ${data.orderId} with status cancellation is successfully published`)
                msg.ack();
            })
            .catch((err) => {
                logger.error(`error-order-cancel: error in cancelling ticket in order service ${err}`)
            });
        
        logger.info("new ticket is successfully cancelled after 15 mins in order service");
    }

}


// order complete listener from payment service

interface OrderCompletionData {
    subject: Subject.OrderComplete,
    data: {
        orderId: number;
        stripeId: string;
    }
}

export class OrderCompletionListenter extends Listener<OrderCompletionData> {
    subject: Subject.OrderComplete = Subject.OrderComplete;
    queueGroupName: string = "complete-status-for-orders";

    onMessage(data: { orderId: number; stripeId: string; }, msg: Message): void {
        const orderRepo = new OrdersRepo(db)
        
        logger.info("order for making complete status is recieved in order service from payment service")
        orderRepo.updateStatusToCancel(data.orderId)
            .then(() => {
                logger.info("order is updated to complete status in order service");
                msg.ack();
            })
            .catch((err) => {
                logger.error(`error-order-complete: error in completing order in order service ${err}`)
            });
        
        logger.info("new order is successfully updated to complete from payment service");
    }

}