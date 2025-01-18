import { OrderStatus, Subject } from "@ticketsdev10/common";
import { TicketCreateListener } from "../listen/listen.types";
// import { natsWrapper } from "../../__mocks__/nats-wrapper";
import { TicketRepo } from "../../db/repo/ticket.repo";
import db from "../../db";


jest.mock('../listen/listen.types');

const setup = async () => {

    const onMessageMock = jest.fn().mockImplementation( async (data , msg) => {
        const ticketRepo = new TicketRepo(db);
        try {
            await ticketRepo.create(data);
            msg.ack();
        } catch (err) {
            console.error(err);
        }
    })

    const ticketListener = {
        subject: Subject.TicketCreated,
        queueGroupName: 'ticket-created-for-orders',
        onMessage: onMessageMock,
        listen: jest.fn(),
    }

    const msg = {
        ack: jest.fn(),
    }

    const ticket = {
        id: 1,
        title: "test",
        price: "12.5",
    }

    return {
        ticketListener,
        ticket,
        msg
    }
}

describe("ticket created listener test", () => {

    let mockCreate: jest.Mock;
    let mockUpdate: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks()

        mockCreate = jest.fn()
        mockUpdate = jest.fn()

        //@ts-ignore
        TicketRepo.mockImplementation(() => {
            return {
                create: mockCreate,
                update: mockUpdate
            }
        })

    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('should recieve data from ticket created listener', async() => {
        const { ticketListener , ticket , msg } = await setup();
        

        mockCreate.mockResolvedValueOnce({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
        })

        ticketListener.listen()
        await ticketListener.onMessage(ticket,msg)



        expect(ticketListener.subject).toBe(Subject.TicketCreated)
        expect(ticketListener.queueGroupName).toBe('ticket-created-for-orders')
        expect(ticketListener.onMessage).toHaveBeenCalled()
        expect(ticketListener.listen).toHaveBeenCalled()
        expect(msg.ack).toHaveBeenCalledTimes(1)
    })

})