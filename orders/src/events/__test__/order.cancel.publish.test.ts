import { OrderStatus, Subject } from "@ticketsdev10/common";
// import { natsWrapper } from "../../__mocks__/nats-wrapper";

jest.mock('../publish/publish.types');

interface OrderCancelledPublishEvent {
    subject: Subject.OrderCancelled;
    data: {
        orderId: number;
        ticketId: number;
        status: OrderStatus;
        expiresAt: string;
    }
}

const setup = async () => {

    const publish = jest.fn().mockImplementation( async (data: OrderCancelledPublishEvent['data']) => {
        return null
    })

    const orderPublisher = {
        subject: Subject.OrderCancelled,
        publish: publish,
    }

    const order = {
        orderId: 1,
        ticketId: 1,
        status: OrderStatus.Cancelled,
        expiresAt: new Date().toISOString()
    }

    return {
        orderPublisher,
        order,
    }
}

describe("order cancle publisher test", () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('should publish data with subject called order:cancelled', async() => {
        const { orderPublisher , order } = await setup();
        orderPublisher.publish(order)
        expect(orderPublisher.subject).toBe(Subject.OrderCancelled)
        expect(orderPublisher.publish).toHaveBeenCalled()
    })

})