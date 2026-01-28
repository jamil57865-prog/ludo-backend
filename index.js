import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import { loginUser } from "./auth.js";
import { getBalance, deposit, withdraw } from "./wallet.js";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 ROOT ROUTE (এটাই আগে ছিল না)
app.get("/", (req, res) => {
  res.send("🚀 Ludo Backend Server is Running");
});

// 🔹 Health check (Render / uptime check)
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: Date.now() });
});

// 🔹 API routes
app.post("/login", loginUser);
app.get("/wallet/:userId", getBalance);
app.post("/wallet/deposit", deposit);
app.post("/wallet/withdraw", withdraw);

// 🔹 Socket setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

io.on("connection", socket => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 🔹 PORT (Render compatible)
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
