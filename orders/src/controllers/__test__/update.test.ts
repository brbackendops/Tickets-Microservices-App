import request from 'supertest';
import { OrderStatus } from "@ticketsdev10/common";
import app from '../../app';
import { signIn } from './utils';
import { OrdersRepo } from '../../db/repo/orders.repo';



jest.mock('../../events/publish/publish.types');
describe("get one order test", () => {

    let mockFindOne: jest.Mock;
    let mockDelete: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks()

        mockFindOne = jest.fn()
        mockDelete = jest.fn()

        //@ts-ignore
        OrdersRepo.mockImplementation(() => {
            return {
                findOne: mockFindOne,
                delete: mockDelete,
            }
        })        
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it("should successfully update order based on order id and ticketid", async() => {
        
        let id = 1
        let ticketId = 1

        mockFindOne.mockResolvedValue({
            id: 1,
            ticketId: 1,
            status: OrderStatus.AwaitingPayment,
        });

        mockDelete.mockResolvedValue({
            id: 1,
            ticketId: 1,
            status: OrderStatus.Cancelled,
        });

        await request(app)
            .delete(`/api/orders/v1/${id}/${ticketId}`)
            .set('Cookie',signIn())
            .send({})
            .expect(200);

        expect(mockFindOne).toHaveBeenCalled()
        expect(mockDelete).toHaveBeenCalled()

    })
})