import TicketRepo from '../../db/repo';
import request from 'supertest';
import app from '../../app';
import { signIn } from './utils';

describe('ticket UPDATE test', () => {
  let mockFindOne: jest.Mock;
  let mockUpdate: jest.Mock;

  beforeAll(() => {
    jest.clearAllMocks();

    mockFindOne = jest.fn();
    mockUpdate = jest.fn();

    //@ts-ignore
    TicketRepo.mockImplementation(() => {
      return {
        findOne: mockFindOne,
        update: mockUpdate,
      };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should update a ticket with ticket id', async () => {
    let ticketData = 1;

    mockFindOne.mockResolvedValue({
      id: 1,
      title: 'test',
      price: '1.00',
      lock: false,
    });

    mockUpdate.mockResolvedValue(null);

    await request(app)
      .get(`/api/tickets/v1/${ticketData}`)
      .set('Cookie', signIn())
      .send({})
      .expect(200);

    expect(mockFindOne).toHaveBeenCalled();
  });
});
