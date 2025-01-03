import 'dotenv/config';
import request from 'supertest';
import app from '../../app';
import AuthRepo from '../../db/repo/db.repo';
import * as jwt from 'jsonwebtoken';
import http from 'http'
import net from 'net'

const SECONDS = 1000;

jest.mock('../../db/repo/db.repo')
jest.mock('../../pkg/jwt/index.ts')


jest.mock('@opentelemetry/api', () => ({
    trace: {
        getTracer: jest.fn(() => ({
            startSpan: jest.fn(() => ({
                setAttribute: jest.fn(),
                setStatus: jest.fn(),
                end: jest.fn()
            }))
        })),

        setSpan: jest.fn(),
        createContextKey: jest.fn()
    },
    context: {
        active: jest.fn(),
        disable: jest.fn(),
        bind: jest.fn(),
        with: jest.fn(),
        setGlobalContextManager: jest.fn(),
    },
    SpanStatusCode: {
        OK: 'OK',
        ERROR: 'ERROR'
    }
}));


jest.mock('../../logger.ts', () => ({
    __esModule: true,
    default: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    },
}));

jest.mock('../../pkg/hash', () => ({
    compareAndverify: jest.fn(() => true),
}))

jest.mock('../../pkg/jwt', () => ({
    generateToken: jest.fn((payload) => jwt.sign(payload,process.env.JWT_KEY!,{ expiresIn: '10m' })),
}))


jest.setTimeout(100 * SECONDS);

describe("testing sign in function handler",() => {

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

    it('should successfully logged in', async () => {

        const testData = {
            id: 1,
            email: "test@test.com",
            password: "password"
        }

        mockFindOne.mockResolvedValueOnce(testData)
        const response = await request(app)
            .post("/api/users/v1/signin")
            .send(testData);

        
        // console.log(response)
        expect(response.status).toBe(200)

    })

})