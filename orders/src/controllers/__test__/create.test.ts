import app from "../../app";
import request from 'supertest'
import { OrdersRepo } from "../../db/repo/orders.repo";
import { OrderStatus } from "@ticketsdev10/common";
import { signIn } from "./utils";
import { TicketRepo } from "../../db/repo/ticket.repo";

interface OrderPayload {
    ticketId: number;
    userId: number;
    status: OrderStatus;
    expiresAt: Date | null;
}

jest.mock("../../events/publish/publish.types")

describe('order creation test', () => {

    let mockCreate: jest.Mock;
    let mockFindOne: jest.Mock;
    let mockfindOneTicket: jest.Mock;
    let mockCheckIsReserved: jest.Mock;
    let mockFindAll: jest.Mock;
    let mockDelete: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks()

        mockCreate = jest.fn()
        mockFindAll = jest.fn()
        mockFindOne = jest.fn()
        mockfindOneTicket = jest.fn()
        mockDelete = jest.fn()
        mockCheckIsReserved = jest.fn()

        //@ts-ignore
        OrdersRepo.mockImplementation(() => {
            return {
                create: mockCreate,
                findOne: mockFindOne,
                findOneTicket: mockfindOneTicket,
                findAll: mockFindAll,
                checkIsReserved: mockCheckIsReserved,
                delete: mockDelete,
            }
        });

        //@ts-ignore
        TicketRepo.mockImplementation(() => {
            return {
                findOne: mockFindOne
            }
        })

    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('should create a order on given ticket', async () => {

        const ticketId = 10;
        const userId = 1
        
        const EXPIRATION_WINDOW = 15 * 60;
        
        const expiration = new Date()
        expiration.setSeconds(expiration.getSeconds() * EXPIRATION_WINDOW)

        const data = {
            ticketId,
            userId,
            status: OrderStatus.Created,
            expiresAt: expiration,
        }

        mockFindOne.mockResolvedValueOnce({
            ticketId,
            userId,
            status: OrderStatus.Created,
            expiresAt: expiration,
        })

        mockCheckIsReserved.mockResolvedValueOnce(false)

        mockCreate.mockResolvedValueOnce(null)
        
        await request(app)
            .post('/api/orders/v1')
            .set('Cookie',signIn())
            .send({
                ticketId,
                userId
            })
            .expect(201);
        
        expect(mockCreate).toHaveBeenCalledTimes(1)
        expect(mockFindOne).toHaveBeenCalledTimes(1)
        expect(mockCheckIsReserved).toHaveBeenCalledTimes(1)

    });

    it('should not create a order on a ticket if it is reserved', async () => {

        let ticketId = 10;
        let userId = 1;
        const EXPIRATION_WINDOW = 15 * 60;

        const expiration = new Date()
        expiration.setSeconds(expiration.getSeconds() * EXPIRATION_WINDOW)        

        mockFindOne.mockResolvedValueOnce({
            id: 1,
            ticketId: 10,
            userId: 1,
            status: OrderStatus.Complete,
            expiresAt: expiration
        })
        mockCheckIsReserved.mockResolvedValueOnce(true)

        const res = await request(app)
            .post('/api/orders/v1')
            .set('Cookie',signIn())
            .send({
                ticketId,
                userId
            });
        
        // expect(result).toBe(true)
        expect(mockCheckIsReserved).toHaveBeenCalledTimes(1);
        expect(mockFindOne).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(400)
        expect(res.body).toEqual({
            status: "failed",
            message: "ticket already reserved"
        })
    })


    it("should not create a order if ticket is not found", async () => {

        const ticketId = 10;
        const userId = 1;

        mockFindOne.mockResolvedValueOnce(null)

        const res = await request(app)
            .post('/api/orders/v1')
            .set('Cookie',signIn())
            .send({
                ticketId,
                userId
            });

        expect(mockFindOne).toHaveBeenCalledTimes(1)
        expect(res.status).toBe(400)
        expect(res.body).toEqual({
            status: "failed",
            message: "ticket not found"            
        })
    })

})