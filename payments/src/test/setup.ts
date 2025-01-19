import { randomBytes } from 'crypto';

jest.mock('../nats-wrapper.ts');
jest.mock('../stripe');

jest.mock('../db/repo/orders.repo');
jest.mock('../db/repo/payments.repo');

jest.mock('../logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

process.env.STRIPE_KEY = randomBytes(4).toString('hex');

beforeAll(() => {
  process.env.JWT_KEY = 'cm9oaXRfYnIgDQo';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
});
