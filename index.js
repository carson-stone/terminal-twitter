import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

const users = {}

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

io.on("connection", (socket) => {
  const { name } = socket.handshake.query

  if (!users[name]) {
    users[name] = { id: socket.id }
    console.log(`${name} has connected`);
    socket.broadcast.emit("entered", name)
  }

  socket.on("disconnect", () => {
    users[name] = null
    io.emit("exited", name)
  })

  socket.on("post", (message, cb) => {
    console.log(`${name}: "${message}"`)

    socket.broadcast.emit("post", name, `"${message}"`)
    cb("OK")
  })
});

const port = 3000;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
