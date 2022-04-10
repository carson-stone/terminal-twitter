#!/usr/bin/env node

import { io as socketIO } from "socket.io-client";
import readline from "readline-sync";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";

const cliOptions = yargs(hideBin(process.argv))
  .usage("Usage: -m <message>")
  .option("m", {
    alias: "message",
    describe: "Your message",
    default: "",
    type: "string",
    demandOption: true
  })
  .argv;

const serverUrl = "ws://127.0.0.1:3000"

const name = readline.question(`What"s your name? `)
console.log(`Welcome ${name}!`)

const io = socketIO(serverUrl, {
  query: { name }}
)

io.on("connect", () => {
  if (cliOptions.message) {
    io.emit("post", cliOptions.message, () => {
      process.exit()
    })
  }
})

io.on("entered", (name) => {
  console.log(`${name} is now online`)
})

io.on("post", (user, message) => {
  const timestamp = chalk.gray(new Date().toLocaleString())

  console.log(`${chalk.green(user)}: "${message}" - ${timestamp}`)
})
