import TicketRepo from '../../db/repo';
import request from 'supertest';
import app from '../../app';
import { signIn } from './utils';

describe('ticket UPDATE test', () => {
  let mockDelete: jest.Mock;

  beforeAll(() => {
    jest.clearAllMocks();

    mockDelete = jest.fn();

    //@ts-ignore
    TicketRepo.mockImplementation(() => {
      return {
        delete: mockDelete,
      };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should delete a ticket with ticket id', async () => {
    let ticketData = 1;

    mockDelete.mockResolvedValue(null);

    await request(app)
      .delete(`/api/tickets/v1/${ticketData}`)
      .set('Cookie', signIn())
      .send({})
      .expect(200);

    expect(mockDelete).toHaveBeenCalled();
  });
});
