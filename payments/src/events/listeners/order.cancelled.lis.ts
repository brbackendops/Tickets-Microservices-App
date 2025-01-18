import { Listener, OrderStatus, Subject } from "@ticketsdev10/common";
import { Message } from "node-nats-streaming";
import db from '../../db';
import { OrdersRepo } from "../../db/repo/orders.repo";
import logger from "../../logger";

interface OrderCancelledEvent {
    subject: Subject.OrderCancelled,
    data: {
        orderId: number,
        version: number,
        ticketId: number,
        userId: number,
        status: OrderStatus,
        price: string,
    }
}

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subject.OrderCancelled = Subject.OrderCancelled;
    queueGroupName: string = "order.cancelled.for.payments";

    onMessage(data: { orderId: number; version: number; ticketId: number; userId: number; status: OrderStatus; price: string; }, msg: Message): void {
        try {
            const ordersRepo = new OrdersRepo(db)

            ordersRepo.update(data?.orderId,data)
                .then(() => {
                    logger.info("order cancelled from event order:cancelled in payments successfully")
                    msg.ack()
                })
                .catch((error) => {
                    logger.info(`order failed to cancelled from event order:cancelled in payments ${error}`)
                    throw error
                })

        } catch (error) {
            throw error
        }
    }
}