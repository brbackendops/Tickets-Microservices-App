import { usersTable } from './../../db/schema/user';
import request from 'supertest';
import app from '../../app';
import db from '../../db';
import { drizzle } from 'drizzle-orm/node-postgres';
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

describe('testing logged out function handler', () => {

    let mockCreate: jest.Mock;
    let mockFindOne: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks()

        mockCreate = jest.fn()
        mockFindOne = jest.fn()

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


    it('should logged out successfully by clearing cookies', async() => {

        const testData = {
            email: "test3@test.com",
            password: "password"
        }
    
    
        mockFindOne.mockImplementation(async() => {
            return null
        })

        mockCreate.mockImplementation(async() => {
            return undefined
        })

        await request(app)
            .post("/api/users/v1/signup")
            .send(testData)
            .expect(201);
        
        const response = await request(app)
            .post("/api/users/v1/signout")
            .send({})
            .expect(200);
        

        expect(response.get('Set-Cookie')?.[0]).toEqual("auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly")


    })
})