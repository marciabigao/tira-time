import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Limpa o banco antes de tudo
beforeAll(async () => {
  await prisma.player.deleteMany();
});

// Desconecta ao final
afterAll(async () => {
  await prisma.$disconnect();
});

describe('Integração: Sorteio de Times (/draw-teams)', () => {
  
  it('Deve barrar sorteio se houver menos goleiros que times', async () => {
    // Cria 1 goleiro e 1 jogador de linha
    const p1 = await prisma.player.create({ data: { name: 'Goleiro Único', ability: 3, position: 'GoalKeeper' } });
    const p2 = await prisma.player.create({ data: { name: 'Linha 1', ability: 4, position: 'FieldPlayer' } });

    // Tenta formar 2 times
    const res = await request(app)
      .post('/draw-teams')
      .send({ playerIds: [p1.id, p2.id], teamsCount: 2 });

    // Verifica erro 400 e a mensagem contendo a regra
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/você deve selecionar pelo menos 2 goleiros/);
  });

  it('Deve distribuir exatamente um goleiro por time no sorteio', async () => {
    // Insere 2 goleiros e 2 jogadores de linha
    const g1 = await prisma.player.create({ data: { name: 'G1', ability: 3, position: 'GoalKeeper' } });
    const g2 = await prisma.player.create({ data: { name: 'G2', ability: 5, position: 'GoalKeeper' } });
    const l1 = await prisma.player.create({ data: { name: 'L1', ability: 4, position: 'FieldPlayer' } });
    const l2 = await prisma.player.create({ data: { name: 'L2', ability: 2, position: 'FieldPlayer' } });

    const res = await request(app)
      .post('/draw-teams')
      .send({
        playerIds: [g1.id, g2.id, l1.id, l2.id],
        teamsCount: 2
      });

    // Valida o sucesso do sorteio
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2); 

    // Verifica se a regra de 1 goleiro por time foi respeitada
    const time1Goleiros = res.body[0].players.filter(p => p.position === 'GoalKeeper');
    const time2Goleiros = res.body[1].players.filter(p => p.position === 'GoalKeeper');

    expect(time1Goleiros.length).toBe(1);
    expect(time2Goleiros.length).toBe(1);
  });

  it('Deve retornar erro se não enviar jogadores ou se número de times for menor que 2', async () => {
    // Tenta sem enviar jogadores
    const res1 = await request(app).post('/draw-teams').send({ playerIds: [], teamsCount: 2 });
    expect(res1.status).toBe(400);
    expect(res1.body.error).toBeDefined();

    // Tenta com menos de 2 times
    const res2 = await request(app).post('/draw-teams').send({ playerIds: ['id-qualquer'], teamsCount: 1 });
    expect(res2.status).toBe(400);
    expect(res2.body.error).toBeDefined();
  });

  it('Deve rebaixar goleiros excedentes para jogadores de linha', async () => {
    // Cria 3 goleiros para apenas 2 times (1 terá que ser rebaixado)
    const g1 = await prisma.player.create({ data: { name: 'G1', ability: 5, position: 'GoalKeeper' } });
    const g2 = await prisma.player.create({ data: { name: 'G2', ability: 4, position: 'GoalKeeper' } });
    const g3 = await prisma.player.create({ data: { name: 'G3 (Pior)', ability: 2, position: 'GoalKeeper' } });
    
    const res = await request(app)
      .post('/draw-teams')
      .send({ playerIds: [g1.id, g2.id, g3.id], teamsCount: 2 });

    expect(res.status).toBe(200);
    
    // Junta todos os jogadores de todos os times em um array só
    const todosJogadores = res.body.flatMap(time => time.players);
    
    // Procura o G3 (que tinha a menor habilidade) e verifica se a API alterou a posição dele para FieldPlayer
    const g3Sorteado = todosJogadores.find(p => p.name === 'G3 (Pior)');
    expect(g3Sorteado.position).toBe('FieldPlayer');
  });

});