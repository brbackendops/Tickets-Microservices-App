import app from '../../app';
import request from 'supertest';
import { signIn } from './utils';

describe('tdd test for tickets controller', () => {
  it('should return 404 on accessing url that is not defined', async () => {
    const res = await request(app).post('/tickets/all').send({});

    expect(res.status).toBe(404);
  });

  it('can only accessed by authenticated users', async () => {
    const res = await request(app).get('/api/tickets/v1');

    expect(res.status).toBe(401);
  });

  it('if user is signed in it should return status code other than 401', async () => {
    const cookie = signIn();
    const res = await request(app).get('/api/tickets').set('Cookie', cookie);

    expect(res.status).not.toEqual(401);
  });
});
