import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';

describe('Unitário: Geração de PDF (/generate-pdf)', () => {
  it('returns 400 if missing body', async () => {
    const res = await request(app).post('/generate-pdf').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns pdf headers when valid body provided', async () => {
    const teams = [
      { totalAbility: 10, players: [{ name: 'A', ability: 5, position: 'FieldPlayer' }] },
    ];
    const matchInfo = { name: 'Partida', location: 'Local', date: new Date().toISOString() };

    const res = await request(app)
      .post('/generate-pdf')
      .send({ teams, matchInfo })
      .buffer()
      .parse((res, callback) => {
        res.setEncoding('binary');
        res.data = '';
        res.on('data', chunk => { res.data += chunk; });
        res.on('end', () => { callback(null, Buffer.from(res.data, 'binary')); });
      });

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toMatch(/application\/pdf/);
  });
});