import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Limpa o banco antes de tudo
beforeAll(async () => {
  await prisma.player.deleteMany();
});

// Desconecta o Prisma no final
afterAll(async () => {
  await prisma.$disconnect();
});

describe('Integração: Rotas de Jogadores (/players)', () => {
  
  it('Deve criar um jogador com dados válidos', async () => {
    const res = await request(app)
      .post('/players')
      .send({
        name: 'Craque Neto',
        ability: 4,
        position: 'FieldPlayer'
      });

    // Valida status e dados retornados
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Craque Neto');
  });

  it('Não deve criar jogador com habilidade fora do intervalo 1-5', async () => {
    const res = await request(app)
      .post('/players')
      .send({
        name: 'Jogador Ruim',
        ability: 10,
        position: 'FieldPlayer'
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

});