import { randomBytes } from 'crypto';
import app from '../../app';
import { OrdersRepo } from '../../db/repo/orders.repo';
import { PaymentsRepo } from '../../db/repo/payments.repo';
import request from 'supertest';
import { signIn } from './utils';
import { OrderStatus } from '@ticketsdev10/common';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

describe('payments create test', () => {
  let mockCreate: jest.Mock;
  let mockOrderFindOne: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockCreate = jest.fn();
    mockOrderFindOne = jest.fn();

    //@ts-ignore
    PaymentsRepo.mockImplementation(() => {
      return {
        create: mockCreate,
      };
    });

    //@ts-ignore
    OrdersRepo.mockImplementation(() => {
      return {
        findOne: mockOrderFindOne,
      };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create payment successfully', async () => {
    const paymentBody = {
      orderId: 1,
      token: 'tok_visa',
    };

    const orderData = {
      id: 1,
      userId: 1,
      orderId: 1,
      ticketId: 2,
      price: '50.00',
      status: OrderStatus.Created,
    };

    mockCreate.mockResolvedValueOnce(1);
    mockOrderFindOne.mockResolvedValueOnce(orderData);

    await request(app)
      .post('/api/payments/v1')
      .set('Cookie', signIn(1))
      .send(paymentBody)
      .expect(201);

    expect(mockCreate).toHaveBeenCalled();
    expect(mockOrderFindOne).toHaveBeenCalled();
  });

  it('should not create payment if order status is cancelled', async () => {
    const paymentBody = {
      orderId: 1,
      token: 'tok_visa',
    };

    const orderData = {
      id: 1,
      userId: 1,
      orderId: 1,
      ticketId: 2,
      price: '50.00',
      status: OrderStatus.Cancelled,
    };

    mockCreate.mockResolvedValueOnce(1);
    mockOrderFindOne.mockResolvedValueOnce(orderData);

    await request(app)
      .post('/api/payments/v1')
      .set('Cookie', signIn(1))
      .send(paymentBody)
      .expect(400);

    expect(mockOrderFindOne).toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
    expect(stripe.charges.create).not.toHaveBeenCalled();
  });

  it('should not create payment if the current user is not equal to the user that created the order', async () => {
    const paymentBody = {
      orderId: 1,
      token: 'tok_visa',
    };

    const orderData = {
      id: 1,
      userId: 2,
      orderId: 1,
      ticketId: 2,
      price: '50.00',
      status: OrderStatus.Cancelled,
    };

    mockCreate.mockResolvedValueOnce(1);
    mockOrderFindOne.mockResolvedValueOnce(orderData);

    await request(app)
      .post('/api/payments/v1')
      .set('Cookie', signIn(1))
      .send(paymentBody)
      .expect(404);

    expect(mockOrderFindOne).toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
    expect(stripe.charges.create).not.toHaveBeenCalled();
  });

  it('should not create if order is not found', async () => {
    const paymentBody = {
      orderId: 1,
      token: 'tok_visa',
    };

    mockCreate.mockResolvedValueOnce(1);
    mockOrderFindOne.mockResolvedValueOnce(null);

    await request(app)
      .post('/api/payments/v1')
      .set('Cookie', signIn(1))
      .send(paymentBody)
      .expect(404);

    expect(mockOrderFindOne).toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
    expect(stripe.charges.create).not.toHaveBeenCalled();
  });
});
