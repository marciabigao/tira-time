import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';

vi.mock('../../src/prismaClient.js', () => ({
  default: {
    player: {
      findMany: vi.fn(),
    },
  },
}));

import prisma from '../../src/prismaClient.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Unitário: Sorteio (/draw-teams)', () => {
  it('returns 400 when no playerIds', async () => {
    const res = await request(app).post('/draw-teams').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Nenhum jogador/i);
  });

  it('returns 400 when not enough goalkeepers', async () => {
    prisma.player.findMany.mockResolvedValue([
      { id: '1', name: 'A', ability: 5, position: 'FieldPlayer' },
      { id: '2', name: 'B', ability: 4, position: 'FieldPlayer' },
    ]);

    const res = await request(app).post('/draw-teams').send({ playerIds: ['1', '2'], teamsCount: 2 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/goleiros/i);
  });

  it('returns teams when enough goalkeepers and field players', async () => {
    const players = [
      { id: 'g1', name: 'G1', ability: 5, position: 'GoalKeeper' },
      { id: 'g2', name: 'G2', ability: 4, position: 'GoalKeeper' },
      { id: 'f1', name: 'F1', ability: 5, position: 'FieldPlayer' },
      { id: 'f2', name: 'F2', ability: 3, position: 'FieldPlayer' },
    ];
    prisma.player.findMany.mockResolvedValue(players);

    const res = await request(app).post('/draw-teams').send({ playerIds: players.map(p => p.id), teamsCount: 2 });
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });
});