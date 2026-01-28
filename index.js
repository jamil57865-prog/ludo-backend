import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { loginUser } from './auth.js';
import { getBalance, deposit, withdraw } from './wallet.js';
// future use
// import { validateMove } from './rules.js';

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());

/* ---------- ROOT ROUTE (VERY IMPORTANT) ---------- */
app.get('/', (req, res) => {
  res.send('✅ Ludo Backend is Live on Render');
});

/* ---------- REST API ROUTES ---------- */
app.post('/login', loginUser);

app.get('/wallet/:userId', getBalance);
app.post('/wallet/deposit', deposit);
app.post('/wallet/withdraw', withdraw);

// example extra test route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

/* ---------- SOCKET.IO ---------- */
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', socket => {
  console.log('🟢 User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

/* ---------- SERVER START ---------- */
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
