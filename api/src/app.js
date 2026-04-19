import 'dotenv/config.js';
import express from 'express';
import pkg from '@prisma/client';
import cors from 'cors';
import PDFDocument from 'pdfkit';

const { PrismaClient } = pkg;

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const allowedPositions = ['GoalKeeper', 'FieldPlayer'];

app.post('/generate-pdf', (req, res) => {
  const { teams, matchInfo } = req.body;

  if (!teams || !matchInfo) {
    return res.status(400).json({ error: 'Dados dos times e da partida são obrigatórios.' });
  }

  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=times.pdf');

  doc.pipe(res);

  doc.fontSize(20).font('Helvetica-Bold').text(matchInfo.name, { align: 'center' });
  doc.fontSize(12).font('Helvetica').text(`${matchInfo.location} - ${new Date(matchInfo.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`, { align: 'center' });
  doc.moveDown(2);

  const teamNames = ["Time Vermelho", "Time Azul", "Time Verde", "Time Amarelo"];
  const teamTextColors = ['#991B1B', '#1E40AF', '#065F46', '#92400E'];

  teams.forEach((team, index) => {
    const textColor = teamTextColors[index % teamTextColors.length];
    const teamName = teamNames[index % teamNames.length];

    doc.fontSize(16).font('Helvetica-Bold').fillColor(textColor).text(teamName);
    doc.fontSize(10).font('Helvetica').text(`Habilidade Total: ${team.totalAbility}`);
    doc.moveDown(0.5);

    team.players.forEach(player => {
      doc.fontSize(12).font(player.position === 'GoalKeeper' ? 'Helvetica-Bold' : 'Helvetica').fillColor('black');
      
      // --- ALTERAÇÃO APLICADA AQUI ---
      const playerLabel = `${player.name} - Habilidade: ${player.ability}`;
      // --- FIM DA ALTERAÇÃO ---

      const positionLabel = player.position === 'GoalKeeper' ? ' (Goleiro)' : '';
      doc.text(playerLabel + positionLabel);
    });

    doc.moveDown(2);
  });

  doc.end();
});


app.post('/draw-teams', async (req, res) => {
  const { playerIds, teamsCount } = req.body;

  if (!playerIds || playerIds.length === 0) {
    return res.status(400).json({ error: 'Nenhum jogador selecionado.' });
  }
  if (!teamsCount || teamsCount < 2) {
    return res.status(400).json({ error: 'O número de times deve ser pelo menos 2.' });
  }

  try {
    const players = await prisma.player.findMany({
      where: {
        id: { in: playerIds },
      },
    });

    let goalkeepers = players.filter(p => p.position === 'GoalKeeper');
    const fieldPlayers = players.filter(p => p.position === 'FieldPlayer');

    if (goalkeepers.length < teamsCount) {
      return res.status(400).json({
        error: `Para formar ${teamsCount} times, você deve selecionar pelo menos ${teamsCount} goleiros. Você selecionou ${goalkeepers.length}.`,
      });
    }

    if (goalkeepers.length > teamsCount) {
      goalkeepers.sort((a, b) => a.ability - b.ability);
      
      const goalkeepersToRelegateCount = goalkeepers.length - teamsCount;
      const relegatedGoalkeepersRaw = goalkeepers.splice(0, goalkeepersToRelegateCount);
      
      const relegatedGoalkeepersAsFieldPlayers = relegatedGoalkeepersRaw.map(player => ({
        ...player,
        position: 'FieldPlayer',
      }));
      
      fieldPlayers.push(...relegatedGoalkeepersAsFieldPlayers);
    }
    
    fieldPlayers.sort((a, b) => b.ability - a.ability);

    goalkeepers.sort(() => Math.random() - 0.5);

    const teams = Array.from({ length: teamsCount }, (_, i) => {
      const goalkeeper = goalkeepers[i];
      return {
        name: `Time ${i + 1}`,
        totalAbility: goalkeeper.ability,
        players: [goalkeeper],
      };
    });

    fieldPlayers.forEach(player => {
      teams.sort((a, b) => a.totalAbility - b.totalAbility);
      const targetTeam = teams[0];
      
      targetTeam.players.push(player);
      targetTeam.totalAbility += player.ability;
    });

    teams.forEach(team => {
      team.players.sort((a, b) => {
        if (a.position === 'GoalKeeper') return -1;
        if (b.position === 'GoalKeeper') return 1;
        return b.ability - a.ability;
      });
    });

    res.json(teams);

  } catch (error) {
    console.error('Erro ao sortear times:', error);
    res.status(500).json({ error: 'Ocorreu um erro inesperado ao sortear os times.' });
  }
});


app.post('/players', async (req, res) => {
  const { name, ability, position } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      error: "name é obrigatório e deve ter pelo menos 2 caracteres"
    });
  }

  if (typeof ability !== 'number' || ability < 1 || ability > 5) {
    return res.status(400).json({ error: 'A habilidade deve ser um número entre 1 e 5.' });
  }

  if (!allowedPositions.includes(position)) {
    return res.status(400).json({ error: `A posição deve ser uma das seguintes: ${allowedPositions.join(', ')}.` });
  }

  try {
    const newPlayer = await prisma.player.create({
      data: { name, ability, position }
    });
    res.status(201).json(newPlayer);
  } catch (error) {
    console.error('Erro ao criar jogador:', error);
    res.status(500).json({ error: 'Erro ao criar jogador.', details: error.message });
  }
});

app.get("/players", async (req, res) => {
  try {
    const players = await prisma.player.findMany({
      orderBy: { name: "asc" }
    });
    res.json(players);
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error);
    res.status(500).json({ error: 'Erro ao buscar jogadores.', details: error.message });
  }
});

app.get("/players/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const player = await prisma.player.findUnique({
      where: { id }
    });
    if (!player) {
      return res.status(404).json({ error: "Jogador não encontrado" });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar jogador" });
  }
});

app.put("/players/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ability, position } = req.body;

    if (name === undefined || ability === undefined || position === undefined) {
      return res.status(400).json({
        error: "name, ability e position são obrigatórios"
      });
    }
    if (name.trim().length < 2) {
      return res.status(400).json({
        error: "name deve ter pelo menos 2 caracteres"
      });
    }
    if (typeof ability !== 'number' || ability < 1 || ability > 5) {
      return res.status(400).json({
        error: "ability deve ser um número entre 1 e 5"
      });
    }
    if (!allowedPositions.includes(position)) {
      return res.status(400).json({
        error: `position deve ser 'GoalKeeper' ou 'FieldPlayer'.`
      });
    }

    const player = await prisma.player.update({
      where: { id },
      data: { name, ability, position }
    });
    res.json(player);
  } catch (error) {
    if (error.code === 'P2025') {
        return res.status(404).json({ error: "Jogador não encontrado para atualização." });
    }
    res.status(500).json({ error: "Erro ao atualizar jogador" });
  }
});

app.delete("/players/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.player.delete({
      where: { id }
    });
    res.json({ message: "Jogador deletado com sucesso" });
  } catch (error) {
    if (error.code === 'P2025') {
        return res.status(404).json({ error: "Jogador não encontrado para exclusão." });
    }
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