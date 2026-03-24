import 'dotenv/config.js';
import express from 'express';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Lista de Posições permitidas ( Goleiro ou Não Goleiro )
const allowedPositions = ['GoalKeeper', 'FieldPlayer'];

app.post('/players', async (req, res) => {
  const { name, ability, position } = req.body;

  if (!name || name.trim().length < 2) {
  return res.status(400).json({
    error: "name é obrigatório e deve ter pelo menos 2 caracteres"
  });
}

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
    console.error('Erro ao criar jogador:', error);
    res.status(500).json({ error: 'Erro ao criar jogador.', details: error.message });
  }

});

// Get para todos jogadores
app.get("/players", async (req, res) => {
  try {
    const players = await prisma.player.findMany({
      orderBy:
      {
        name: "asc"
      }     
      });

    res.json(players);
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error);
    res.status(500).json({ error: 'Erro ao buscar jogadores.', details: error.message });
  }
});

// Get por ID
app.get("/players/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const player = await prisma.player.findUnique({
      where: {
        id: id
      }
    });

    if (!player) {
      return res.status(404).json({ error: "Jogador não encontrado" });
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar jogador" });
  }
});

// PUT update player 
app.put("/players/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ability, position } = req.body;

    if (!name || !ability || !position) {
      return res.status(400).json({
        error: "name, ability e position são obrigatórios"
      });
    }

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        error: "name é obrigatório e deve ter pelo menos 2 caracteres"
      });
    }

    if (ability < 1 || ability > 5) {
      return res.status(400).json({
        error: "ability deve estar entre 1 e 5"
      });
    }

    if (!allowedPositions.includes(position)) {
      return res.status(400).json({
        error: `position deve ser uma das seguintes: ${allowedPositions.join(', ')}.`
      });
    }

    const player = await prisma.player.update({
      where: {
        id: id
      },
      data: {
        name,
        ability,
        position
      }
    });

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar jogador" });
  }
});

// DELETE player
app.delete("/players/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.player.delete({
      where: {
        id: id
      }
    });

    res.json({ message: "Jogador deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar jogador" });
  }
});


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Porta ${PORT} já está em uso`);
  } else {
    console.error('Erro ao iniciar servidor:', err);
  }
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\nEncerrando servidor...');
  server.close(() => {
    prisma.$disconnect().then(() => {
      console.log('Servidor encerrado');
      process.exit(0);
    });
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejection não tratada:', reason);
});