
jest.mock('../nats-wrapper.ts');
jest.mock("../logger", () => ({
    __esModule: true,
    default: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    },
}));

beforeAll(() => {

})