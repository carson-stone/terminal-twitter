#!/usr/bin/env node

import { io as socketIO } from "socket.io-client";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import { readFileSync } from "fs"

const cliOptions = yargs(hideBin(process.argv))
  .usage("Usage: -m <message>")
  .option("m", {
    alias: "message",
    describe: "Your message",
    default: "",
    type: "string",
    demandOption: true
  })
  .usage("Usage: -n <name>")
  .option("n", {
    alias: "name",
    describe: "Your name",
    default: "",
    type: "string",
    demandOption: true
  })
  .argv;

const config = JSON.parse(readFileSync("./tx.config.json"))

const serverUrl = "ws://127.0.0.1:3000"

const name = cliOptions.name || config.name

const io = socketIO(serverUrl, {
  query: { name }
})

io.on("connect", () => {
  if (cliOptions.message) {
    io.emit("post", cliOptions.message, () => {
      process.exit()
    })
  } else {
    console.log(chalk.yellow.bold("Connected to the server!"))
  }
})

io.on("entered", (name) => {
  console.log(`${name} is now online`)
})
io.on("exited", (name) => {
  console.log(`${name} has gone offline`)
})

io.on("post", (user, message) => {
  const timestamp = chalk.gray(new Date().toLocaleString())

  console.log(`${timestamp} - ${chalk.green(user)}: ${message}`)
})

// handle ctrl+c
function exitHandler() {
  io.disconnect()
  process.exit();
}

process.on('SIGINT', exitHandler.bind(null));
