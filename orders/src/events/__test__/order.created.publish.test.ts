import { OrderStatus, Subject } from "@ticketsdev10/common";
// import { natsWrapper } from "../../__mocks__/nats-wrapper";

jest.mock('../publish/publish.types');

interface OrderCreatedPublishEvent {
    subject: Subject.OrderCreated;
    data: {
        orderId: number;
        ticketId: number;
        status: OrderStatus;
        expiresAt: string;
    }
}

const setup = async () => {

    const publish = jest.fn().mockImplementation( async (data: OrderCreatedPublishEvent['data']) => {
        return null
    })

    const orderPublisher = {
        subject: Subject.OrderCreated,
        publish: publish,
    }

    const order = {
        orderId: 1,
        ticketId: 1,
        status: OrderStatus.Created,
        expiresAt: new Date().toISOString()
    }

    return {
        orderPublisher,
        order,
    }
}

describe("order created publisher test", () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('should publish data with subject called order:create', async() => {
        const { orderPublisher , order } = await setup();
        orderPublisher.publish(order);

        expect(orderPublisher.subject).toBe(Subject.OrderCreated);
        expect(orderPublisher.publish).toHaveBeenCalled();
    })

})