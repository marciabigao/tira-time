import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';

describe('Integração: Geração de PDF (/generate-pdf)', () => {
  
  it('Deve gerar um arquivo PDF com os times sorteados', async () => {
    // Payload mockado
    const payload = {
      matchInfo: { 
        name: 'Pelada de Sexta', 
        location: 'Quadra Central', 
        date: '2026-06-15T20:00:00.000Z' 
      },
      teams: [
        { 
          totalAbility: 5, 
          players: [{ name: 'Goleiro Fixo', ability: 5, position: 'GoalKeeper' }] 
        }
      ]
    };

    const res = await request(app)
      .post('/generate-pdf')
      .send(payload);

    // Valida status e headers do PDF
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.headers['content-disposition']).toContain('attachment; filename=times.pdf');
    
    // Verifica se os bytes não estão vazios
    const isBufferPopulated = res.body instanceof Buffer ? res.body.length > 0 : res.text.length > 0;
    expect(isBufferPopulated).toBe(true);
  });

  it('Deve retornar erro 400 se faltarem dados da partida', async () => {
    const res = await request(app)
      .post('/generate-pdf')
      .send({}); // Envia sem teams e matchInfo

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

});