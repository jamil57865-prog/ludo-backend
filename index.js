import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { loginUser } from './auth.js';
import { getBalance, deposit, withdraw } from './wallet.js';
import { validateMove } from './rules.js';

const app = express();
app.use(cors());
app.use(express.json());

/* =====================
   ROOT TEST ROUTE
===================== */
app.get('/', (req, res) => {
  res.status(200).send('Ludo Backend is Live ✅');
});

/* =====================
   AUTH ROUTES
===================== */
app.post('/login', loginUser);

/* =====================
   WALLET ROUTES
===================== */
app.get('/wallet/:userId', getBalance);
app.post('/wallet/deposit', deposit);
app.post('/wallet/withdraw', withdraw);

/* =====================
   GAME RULES (TEST)
===================== */
app.post('/rules/validate', (req, res) => {
  const result = validateMove(req.body);
  res.json(result);
});

/* =====================
   SOCKET.IO SETUP
===================== */
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('join-room', roomId => {
    socket.join(roomId);
    socket.to(roomId).emit('player-joined', socket.id);
  });

  socket.on('move', data => {
    socket.to(data.roomId).emit('opponent-move', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

/* =====================
   SERVER START
===================== */
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
