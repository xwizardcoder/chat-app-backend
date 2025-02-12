const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chat-app-frontend-eight-dusky.vercel.app/",
    methods: ["GET", "POST"],
  },
});

let users = {}; // Store connected users

app.get("/", (req, res) => {
  res.send("Chat server is running...");
});

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  // Handle user joining
  socket.on("join_chat", (username) => {
    users[socket.id] = username;
    io.emit("receive_message", { username: "System", message: `${username} joined the chat!` });
  });

  // Handle sending messages
  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      io.emit("receive_message", { username: "System", message: `${username} left the chat.` });
      delete users[socket.id];
    }
    console.log("User disconnected: " + socket.id);
  });
});

server.listen(io, () => {
  console.log("Server is running on port 5000");
});
