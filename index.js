import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { loginUser } from './auth.js';
import { getBalance, deposit, withdraw } from './wallet.js';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

// REST API routes
app.post('/login', loginUser);
app.get('/wallet/:userId', getBalance);
app.post('/wallet/deposit', deposit);
app.post('/wallet/withdraw', withdraw);

// Socket placeholder (future online play)
io.on('connection', socket => {
  console.log('User connected:', socket.id);
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
