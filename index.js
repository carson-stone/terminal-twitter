import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

io.on("connection", (socket) => {
  const { name } = socket.handshake.query
  console.log(`${name} has connected`);

  socket.broadcast.emit("entered", name)
});

const port = 3000;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
