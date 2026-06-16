import { describe, it, expect, afterEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';

vi.mock('../../src/prismaClient.js', () => ({
  default: {
    player: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import prisma from '../../src/prismaClient.js';

afterEach(() => {
  vi.clearAllMocks();
});

describe('Players unit tests', () => {
  it('POST /players returns 400 for short name', async () => {
    const res = await request(app).post('/players').send({ name: 'A', ability: 3, position: 'FieldPlayer' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/obrigatório/i);
  });

  it('POST /players creates player', async () => {
    const newPlayer = { id: '1', name: 'Maria', ability: 4, position: 'FieldPlayer' };
    prisma.player.create.mockResolvedValue(newPlayer);

    const res = await request(app).post('/players').send({ name: 'Maria', ability: 4, position: 'FieldPlayer' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(newPlayer);
    expect(prisma.player.create).toHaveBeenCalledWith({ data: { name: 'Maria', ability: 4, position: 'FieldPlayer' } });
  });

  it('GET /players returns list', async () => {
    const players = [{ id: '1', name: 'A', ability: 1, position: 'FieldPlayer' }];
    prisma.player.findMany.mockResolvedValue(players);
    const res = await request(app).get('/players');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(players);
  });

  it('GET /players/:id returns 404 when not found', async () => {
    prisma.player.findUnique.mockResolvedValue(null);
    const res = await request(app).get('/players/unknown');
    expect(res.status).toBe(404);
  });

  it('PUT /players/:id returns 400 when missing fields', async () => {
    const res = await request(app).put('/players/1').send({ name: 'X' });
    expect(res.status).toBe(400);
  });

  it('PUT /players/:id updates player', async () => {
    const updated = { id: '1', name: 'Pedro', ability: 5, position: 'GoalKeeper' };
    prisma.player.update.mockResolvedValue(updated);
    const res = await request(app).put('/players/1').send({ name: 'Pedro', ability: 5, position: 'GoalKeeper' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
  });

  it('PUT /players/:id returns 404 on P2025', async () => {
    const err = new Error('not found');
    err.code = 'P2025';
    prisma.player.update.mockRejectedValue(err);
    const res = await request(app).put('/players/unknown').send({ name: 'X', ability: 3, position: 'FieldPlayer' });
    expect(res.status).toBe(404);
  });

  it('DELETE /players/:id deletes player', async () => {
    prisma.player.delete.mockResolvedValue({});
    const res = await request(app).delete('/players/1');
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deletado/i);
  });

  it('DELETE /players/:id returns 404 on P2025', async () => {
    const err = new Error('not found');
    err.code = 'P2025';
    prisma.player.delete.mockRejectedValue(err);
    const res = await request(app).delete('/players/unknown');
    expect(res.status).toBe(404);
  });
});
