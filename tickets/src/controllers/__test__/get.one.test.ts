import TicketRepo from '../../db/repo';
import request from 'supertest';
import app from '../../app';
import { signIn } from './utils';

// jest.mock("../../db/repo");
describe('ticket GET test', () => {
  let mockFindOne: jest.Mock;
  let mockFindMany: jest.Mock;
  let mockFindAll: jest.Mock;

  beforeAll(() => {
    jest.clearAllMocks();

    mockFindOne = jest.fn();
    mockFindMany = jest.fn();
    mockFindAll = jest.fn();

    //@ts-ignore
    TicketRepo.mockImplementation(() => {
      return {
        findOne: mockFindOne,
        findMany: mockFindMany,
      };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get a ticket with ticket id', async () => {
    let ticketData = 1;

    mockFindOne.mockResolvedValue({
      id: 1,
      title: 'test',
      price: '1.00',
    });

    await request(app)
      .get(`/api/tickets/v1/${ticketData}`)
      .set('Cookie', signIn())
      .send({})
      .expect(200);

    expect(mockFindOne).toHaveBeenCalled();
  });
});
