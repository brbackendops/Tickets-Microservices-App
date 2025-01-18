import { OrderStatus, Publisher, Subject } from "@ticketsdev10/common";

// order created publisher

interface OrderCreatedPublishEvent {
    subject: Subject.OrderCreated;
    data: {
        orderId: number;
        ticketId: number;
        userId: number;
        status: OrderStatus;
        expiresAt: string;
    }
}

export class OrderCreatedPublisher extends Publisher<OrderCreatedPublishEvent> {
    subject: Subject.OrderCreated = Subject.OrderCreated;
}

// order cancelled publisher

interface OrderCancelledPublishEvent {
    subject: Subject.OrderCancelled;
    data: {
        orderId: number;
        ticketId: number;
        userId: number;
        status: OrderStatus;
    }
}


export class OrderCancelledPublisher extends Publisher<OrderCancelledPublishEvent> {
    subject: Subject.OrderCancelled = Subject.OrderCancelled;
}


