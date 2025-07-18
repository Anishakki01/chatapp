const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`✅ User Connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    console.log("📥 Message from client:", data);

    // ✅ Broadcast to all clients including sender
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("🚀 Server is running on http://localhost:3001");
});
