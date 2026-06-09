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

it('Deve listar todos os jogadores cadastrados', async () => {
    // Preparação: Insere direto no banco para garantir que há dados
    await prisma.player.create({
      data: { name: 'João Araldi', ability: 5, position: 'FieldPlayer' }
    });

    // Ação: Bate na rota GET
    const res = await request(app).get('/players');

    // Verificação
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    
    // Verifica se o jogador que inserimos está na lista retornada
    const joao = res.body.find(p => p.name === 'João Araldi');
    expect(joao).toBeDefined();
  });

  it('Deve atualizar os dados de um jogador existente', async () => {
    // Preparação
    const player = await prisma.player.create({
      data: { name: 'Matheus Pereira', ability: 4, position: 'FieldPlayer' }
    });

    // Ação: Tenta atualizar a habilidade desse jogador
    const res = await request(app)
      .put(`/players/${player.id}`)
      .send({
        name: 'Matheus Pereira',
        ability: 5, 
        position: 'FieldPlayer'
      });

    // Verificação
    expect(res.status).toBe(200);
    expect(res.body.ability).toBe(5);
  });

  it('Deve deletar um jogador existente', async () => {
    // Preparação
    const player = await prisma.player.create({
      data: { name: 'Jogador Temporário', ability: 2, position: 'GoalKeeper' }
    });

    // Ação
    const resDelete = await request(app).delete(`/players/${player.id}`);
    expect(resDelete.status).toBe(200);

    // Verificação: Consulta o banco diretamente para ver se realmente sumiu
    const deletedPlayer = await prisma.player.findUnique({ where: { id: player.id } });
    expect(deletedPlayer).toBeNull();
  });

  it('Deve retornar erro ao criar jogador com nome menor que 2 caracteres', async () => {
    const res = await request(app).post('/players').send({
      name: 'A', // Inválido
      ability: 3,
      position: 'FieldPlayer'
    });
    expect(res.status).toBe(400);
  });

  it('Deve retornar erro ao criar jogador com posição inválida', async () => {
    const res = await request(app).post('/players').send({
      name: 'Teste Posição',
      ability: 3,
      position: 'Zagueiro' // Inválido
    });
    expect(res.status).toBe(400);
  });

  it('Deve buscar um jogador específico por ID (GET /players/:id)', async () => {
    const player = await prisma.player.create({
      data: { name: 'Busca ID', ability: 4, position: 'GoalKeeper' }
    });

    const res = await request(app).get(`/players/${player.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Busca ID');
  });

  it('Deve retornar 404 ao buscar jogador com ID inexistente', async () => {
    const res = await request(app).get('/players/id-falso-123');
    expect(res.status).toBe(404);
  });

  it('Deve retornar erro 404 ao tentar atualizar jogador inexistente', async () => {
    const res = await request(app).put('/players/id-falso-123').send({
      name: 'Fantasma',
      ability: 3,
      position: 'FieldPlayer'
    });
    expect(res.status).toBe(404);
  });

  it('Deve retornar erro 404 ao tentar deletar jogador inexistente', async () => {
    const res = await request(app).delete('/players/id-falso-123');
    expect(res.status).toBe(404);
  });

  it('Deve retornar erro 400 ao tentar atualizar com dados inválidos', async () => {
    const res = await request(app).put('/players/qualquer-id').send({
      name: 'A', // Inválido (< 2 chars)
      ability: 10, // Inválido (> 5)
      position: 'Zagueiro' // Inválido
    });
    expect(res.status).toBe(400);
  });