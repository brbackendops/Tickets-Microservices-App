import {
    Listener,
    OrderStatus,
    Subject
} from '@ticketsdev10/common';
import {
    Message
} from 'node-nats-streaming';
import {
    queue
} from '../../queue';


interface OrderCreatedI {
    subject: Subject.OrderCreated,
        data: {
            orderId: number;
            ticketId: number;
            userId: number;
            status: OrderStatus;
            expiresAt: string;
        }
}

export class OrderCreatedListener extends Listener < OrderCreatedI > {

    subject: Subject.OrderCreated = Subject.OrderCreated;
    queueGroupName: string = "order.created.for.expiration";

    async onMessage(data: {
        orderId: number;ticketId: number;expiresAt: string; userId: number;
    }, msg: Message): Promise < void > {

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

        await queue.add({
            orderId: data.orderId,
        }, {
            delay,
        })
        msg.ack()
    }
}