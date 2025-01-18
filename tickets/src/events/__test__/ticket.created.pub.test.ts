import { OrderStatus, Subject } from "@ticketsdev10/common";
// import { natsWrapper } from "../../__mocks__/nats-wrapper";

jest.mock('../publish/publish.types');

interface TicketCreatedEvent {
    subject: Subject.TicketCreated,
    data: {
        id: number;
        title: string;
        price: string;
    }
}

const setup = async () => {

    const publish = jest.fn().mockImplementation( async (data: TicketCreatedEvent['data']) => {
        return null
    })

    const ticketPublisher = {
        subject: Subject.TicketCreated,
        publish: publish,
    }

    const ticket = {
        id: 1,
        title: 'test',
        price: '0.00'
    }

    return {
        ticketPublisher,
        ticket,
    }
}

describe("tickets created publisher test", () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('should publish data with subject called ticket:create', async() => {
        const { ticketPublisher , ticket } = await setup();
        ticketPublisher.publish(ticket);

        expect(ticketPublisher.subject).toBe(Subject.TicketCreated);
        expect(ticketPublisher.publish).toHaveBeenCalled();
    })

})