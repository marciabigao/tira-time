import 'dotenv/config.js';
import express from 'express';
import pkg from '@prisma/client';
import sqlite3 from 'better-sqlite3';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const { PrismaClient } = pkg;

const app = express();
const client = new sqlite3('./dev.db');
const adapter = new PrismaBetterSqlite3(client);
const prisma = new PrismaClient({ adapter });

app.use(express.json());

// Lista de Posições permitidas ( Goleiro ou Não Goleiro )
const allowedPositions = ['GoalKeeper', 'FieldPlayer'];

app.post('/players', async (req, res) => {
  const { name, ability, position } = req.body;

  // Validação de habilidade (1-5)
  if (typeof ability !== 'number' || ability < 1 || ability > 5) {
    return res.status(400).json({ error: 'A habilidade deve ser um número entre 1 e 5.' });
  }

  if (!allowedPositions.includes(position)) {
    return res.status(400).json({ error: `A posição deve ser uma das seguintes: ${allowedPositions.join(', ')}.` });
  }

  try {
    const newPlayer = await prisma.player.create({
        data: {
          name,
          ability,
          position,
        },} )
    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar jogador.' });
  }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});