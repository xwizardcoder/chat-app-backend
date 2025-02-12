const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chat-app-frontend-eight-dusky.vercel.app/", // Update if frontend is hosted elsewhere
    methods: ["GET", "POST"],
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("user_joined", (username) => {
    io.emit("receive_message", { username: "System", message: `${username} joined the chat` });
  });

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
