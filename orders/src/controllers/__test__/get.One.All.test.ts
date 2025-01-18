import request from 'supertest';
import { OrdersRepo } from '../../db/repo/orders.repo';
import app from '../../app';
import { signIn } from './utils';
import { OrderStatus } from '@ticketsdev10/common';

describe("get one order test", () => {

    let mockFindOne: jest.Mock;
    let mockFindAll: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks()

        mockFindOne = jest.fn()
        mockFindAll = jest.fn()

        //@ts-ignore
        OrdersRepo.mockImplementation(() => {
            return {
                findOne: mockFindOne,
                findAll: mockFindAll,
            }
        })
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it("should successfully get order based on order id and ticketid", async() => {

        let orderId = 1
        let ticketId = 1

        mockFindOne.mockResolvedValueOnce({
            id: 1,
            ticketId: 1,
            status: OrderStatus.Created
        })

        await request(app)
            .get(`/api/orders/v1/${orderId}/${ticketId}`)
            .set('Cookie',signIn())
            .send({})
            .expect(200);
        
        expect(mockFindOne).toHaveBeenCalled()
    });

    it("should successfully get all orders", async() => {

        mockFindAll.mockResolvedValueOnce([{
            id: 1,
            ticketId: 1,
            status: OrderStatus.Created
        }])

        await request(app)
            .get(`/api/orders/v1/`)
            .set('Cookie',signIn())
            .send({})
            .expect(200);
        
        expect(mockFindAll).toHaveBeenCalled()
    })    
})