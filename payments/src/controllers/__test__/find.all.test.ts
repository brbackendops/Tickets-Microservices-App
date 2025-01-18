import app from "../../app";
import { PaymentsRepo } from "../../db/repo/payments.repo";
import request from 'supertest'
import { signIn } from './utils';


describe('payments create test', () => {

    let mockFindAll: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        mockFindAll = jest.fn();

        //@ts-ignore
        PaymentsRepo.mockImplementation(() => {
            return {
                findAll: mockFindAll
            }
        });
    })

    afterEach(() => {
        jest.resetAllMocks()
    })


    it('should return find all payment successfully', async () => {

        mockFindAll.mockResolvedValueOnce([{}])

        await request(app)
            .get("/api/payments/v1")
            .set('Cookie',signIn(1))
            .send({})
            .expect(200);
        
        expect(mockFindAll).toHaveBeenCalled()
    });
});