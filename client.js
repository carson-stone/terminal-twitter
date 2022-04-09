import { io } from "socket.io-client";

const serverUrl = "http://127.0.0.1:3000"

const socket = io(serverUrl)

socket.on("connect", () => {
  console.log("Connected to the server")
});
