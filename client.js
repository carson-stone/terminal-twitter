import { io as socketIO } from "socket.io-client";
import readline from "readline-sync";

const serverUrl = "ws://127.0.0.1:3000"

async function main() {
  const name = readline.question(`What's your name? `)
  console.log(`Welcome ${name}!`)

  const io = socketIO(serverUrl, {
    query: { name }}
  )

  io.on("connection", () => {
    console.log("You're connected!")
  });

  io.on("entered", (name) => {
    console.log(`${name} is now online`)
  })
}

main()
