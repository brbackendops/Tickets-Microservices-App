import TicketRepo from "../../db/repo";
import request from 'supertest';
import app from "../../app";
import { signIn } from "./utils";


// jest.mock("../../db/repo");
describe('ticket ALL test', () => {

    let mockFindMany: jest.Mock;


    beforeAll(() => {
        jest.clearAllMocks();

        mockFindMany = jest.fn()

        //@ts-ignore
        TicketRepo.mockImplementation(() => {
            return {
                findMany: mockFindMany
            }
        })

    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('should return all tickets', async() => {
        mockFindMany.mockImplementation(() => {
            return [
                {
                    id: 1,
                    title: "test",
                    price: "1.00",
                    version: 1,
                    userId: 1,
                    createdAt: new Date()
                }
            ]
        })

        
        const res = await request(app)
        .get('/api/tickets/v1')
        .set('Cookie',signIn())
        .send({});
        
        expect(mockFindMany).toHaveBeenCalledTimes(1)
        expect(res.status).toBe(200)
    })
})