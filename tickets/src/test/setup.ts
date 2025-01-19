jest.mock('../nats-wrapper.ts');
jest.mock('../db/repo');
jest.mock('../logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

beforeAll(() => {
  process.env.JWT_KEY = 'cm9oaXRfYnIgDQo';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
});
