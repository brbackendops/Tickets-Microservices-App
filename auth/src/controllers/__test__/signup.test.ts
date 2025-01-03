import {
    usersTable
} from './../../db/schema/user';
import request from 'supertest';
import app from '../../app';
import AuthRepo from '../../db/repo/db.repo';


jest.mock('../../db/repo/db.repo')
jest.mock('../../logger.ts', () => ({
    __esModule: true,
    default: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    },
}));

describe("sign up handler test", () => {
    let mockCreate: jest.Mock;
    let mockFindOne: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks()

        mockCreate = jest.fn();
        mockFindOne = jest.fn();

        //@ts-ignore
        AuthRepo.mockImplementation(() => {
            return {
                create: mockCreate,
                findOne: mockFindOne
            }
        })

    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('returns a 201 on successful signup', async () => {

        const testData = {
            email: "test@test.com",
            password: "password"
        }

        mockFindOne.mockImplementation(async () => {
            return null
        })

        mockCreate.mockImplementation(async () => {
            return undefined
        })

        const res = await request(app)
            .post('/api/users/v1/signup')
            .send(testData);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            status: 'success',
            messgae: 'user created successfully'
        });
    })

    it('return 409 with error "user already exists" ', async () => {

        const testData = {
            email: "test@test.com",
            password: "password"
        }

        mockFindOne.mockResolvedValueOnce(testData)

        mockCreate.mockResolvedValueOnce(undefined)

        const res = await request(app)
            .post("/api/users/v1/signup")
            .send(testData);


        expect(mockFindOne).toHaveBeenCalledTimes(1)
        expect(res.status).toBe(409)
    })

    it('return 400 with bad email', async () => {

        const testData = {
            email: "test.test.com",
            password: "password"
        }

        mockFindOne.mockResolvedValueOnce(null)

        mockCreate.mockResolvedValueOnce(undefined)

        const res = await request(app)
            .post("/api/users/v1/signup")
            .send(testData)


        expect(res.status).toBe(400);
    })
})