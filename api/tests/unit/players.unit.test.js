import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';

// Faz o mock completo das funções do Prisma Client para testes unitários
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

// Limpa os mocks antes de cada teste para evitar interferências entre eles
beforeEach(() => {
  vi.clearAllMocks();
});

describe('Unitário: Jogadores', () => {
  
  // Valida a recusa da API ao tentar criar um jogador com nome muito curto
  it('POST /players returns 400 for short name', async () => {
    const res = await request(app).post('/players').send({ name: 'A', ability: 3, position: 'FieldPlayer' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/obrigatório/i);
  });

  // Testa o caminho de sucesso: se o mock é chamado e retorna 201 com o jogador
  it('POST /players creates player', async () => {
    const newPlayer = { id: '1', name: 'Maria', ability: 4, position: 'FieldPlayer' };
    prisma.player.create.mockResolvedValue(newPlayer);

    const res = await request(app).post('/players').send({ name: 'Maria', ability: 4, position: 'FieldPlayer' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(newPlayer);
    expect(prisma.player.create).toHaveBeenCalledWith({ data: { name: 'Maria', ability: 4, position: 'FieldPlayer' } });
  });

  // Verifica se a listagem retorna o array de jogadores corretamente
  it('GET /players returns list', async () => {
    const players = [{ id: '1', name: 'A', ability: 1, position: 'FieldPlayer' }];
    prisma.player.findMany.mockResolvedValue(players);
    const res = await request(app).get('/players');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(players);
  });

  // Valida o retorno HTTP 404 quando a busca por ID não encontra o jogador no banco
  it('GET /players/:id returns 404 when not found', async () => {
    prisma.player.findUnique.mockResolvedValue(null);
    const res = await request(app).get('/players/unknown');
    expect(res.status).toBe(404);
  });

  // Testa se a rota bloqueia a atualização se faltarem campos obrigatórios no body
  it('PUT /players/:id returns 400 when missing fields', async () => {
    const res = await request(app).put('/players/1').send({ name: 'X' });
    expect(res.status).toBe(400);
  });

  // Verifica o fluxo de sucesso ao atualizar os dados de um jogador existente
  it('PUT /players/:id updates player', async () => {
    const updated = { id: '1', name: 'Pedro', ability: 5, position: 'GoalKeeper' };
    prisma.player.update.mockResolvedValue(updated);
    const res = await request(app).put('/players/1').send({ name: 'Pedro', ability: 5, position: 'GoalKeeper' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
  });

  // Valida a conversão do erro nativo do Prisma (P2025) para um erro HTTP 404 (Não Encontrado) na atualização
  it('PUT /players/:id returns 404 on P2025', async () => {
    const err = new Error('not found');
    err.code = 'P2025';
    prisma.player.update.mockRejectedValue(err);
    // Usando um nome válido ("Jogador") para passar pela validação de texto da API antes de cair no mock do Prisma
    const res = await request(app).put('/players/unknown').send({ name: 'Jogador', ability: 3, position: 'FieldPlayer' });
    expect(res.status).toBe(404);
  });

  // Verifica o fluxo de sucesso ao excluir um jogador do banco
  it('DELETE /players/:id deletes player', async () => {
    prisma.player.delete.mockResolvedValue({});
    const res = await request(app).delete('/players/1');
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deletado/i);
  });

  // Valida a conversão do erro nativo do Prisma (P2025) para HTTP 404 ao tentar deletar algo inexistente
  it('DELETE /players/:id returns 404 on P2025', async () => {
    const err = new Error('not found');
    err.code = 'P2025';
    prisma.player.delete.mockRejectedValue(err);
    const res = await request(app).delete('/players/unknown');
    expect(res.status).toBe(404);
  });
});