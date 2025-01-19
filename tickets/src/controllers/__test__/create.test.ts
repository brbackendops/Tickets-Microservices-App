import TicketRepo from '../../db/repo';
import request from 'supertest';
import app from '../../app';
import { signIn } from './utils';

describe('ticket create test', () => {
  let mockCreate: jest.Mock;

  beforeAll(() => {
    jest.clearAllMocks();

    mockCreate = jest.fn();

    //@ts-ignore
    TicketRepo.mockImplementation(() => {
      return {
        create: mockCreate,
      };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a ticket with given data', async () => {
    let ticketData = {
      title: 'test',
      price: '1.00',
    };

    mockCreate.mockResolvedValue({
      id: 1,
      title: 'test',
      price: '1.00',
    });

    await request(app)
      .post('/api/tickets/v1')
      .set('Cookie', signIn())
      .send(ticketData)
      .expect(201);

    expect(mockCreate).toHaveBeenCalled();
  });
});
