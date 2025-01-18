
// declare global {
//     namespace NodeJS {
//         interface Global {
//             signin(): string[];
//         }
//     }
// }


jest.mock('../nats-wrapper.ts');
jest.mock("../db");
jest.mock("../logger", () => ({
    __esModule: true,
    default: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    },
}));

jest.mock("../db/repo/orders.repo");
jest.mock("../db/repo/ticket.repo");

beforeAll(() => {
    process.env.JWT_KEY='cm9oaXRfYnIgDQo';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
})