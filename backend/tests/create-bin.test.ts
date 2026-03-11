import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

const dbMocks = vi.hoisted(() => ({
  getByRoute: vi.fn(),
  create: vi.fn()
}));

vi.mock('../src/services/db/index.js', () => ({
  default: {
    bins: {
      getByRoute: dbMocks.getByRoute,
      create: dbMocks.create
    }
  }
}));

vi.mock('nanoid', () => ({
  nanoid: () => 'test-token'
}));

describe('POST /bins/:binRoute', () => {
  beforeEach(() => {
    dbMocks.getByRoute.mockReset();
    dbMocks.create.mockReset();
  });

  it('returns 201 with token on success', async () => {
    dbMocks.getByRoute.mockResolvedValue(null);
    dbMocks.create.mockResolvedValue({
      id: '1',
      bin_route: 'abc123',
      token: 'test-token'
    });

    const { default: app } = await import('../src/app.ts');

    const res = await request(app)
      .post('/bins/ignored')
      .send({ bin_route: 'abc123' })
      .expect(201);

    expect(res.body).toEqual({ bin_route: 'abc123', token: 'test-token' });
    expect(dbMocks.getByRoute).toHaveBeenCalledWith('abc123');
    expect(dbMocks.create).toHaveBeenCalledWith('abc123', 'test-token');
  });

  it('returns 400 when bin_route is missing', async () => {
    const { default: app } = await import('../src/app.ts');

    const res = await request(app)
      .post('/bins/ignored')
      .send({})
      .expect(400);

    expect(res.body).toEqual({ error: 'Invalid JSON: "bin_route" is required.' });
  });

  it('returns 400 when bin_route is not a string', async () => {
    const { default: app } = await import('../src/app.ts');

    const res = await request(app)
      .post('/bins/ignored')
      .send({ bin_route: 123 })
      .expect(400);

    expect(res.body).toEqual({ error: 'Invalid JSON: "bin_route" must be a string.' });
  });

  it('returns 409 when bin already exists', async () => {
    dbMocks.getByRoute.mockResolvedValue({
      id: '1',
      bin_route: 'abc123',
      token: 'existing'
    });

    const { default: app } = await import('../src/app.ts');

    const res = await request(app)
      .post('/bins/ignored')
      .send({ bin_route: 'abc123' })
      .expect(409);

    expect(res.body).toEqual({ error: 'Bin with route abc123 already exists.' });
  });
});
