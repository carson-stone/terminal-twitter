#!/usr/bin/env node

import { io as socketIO } from "socket.io-client";
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
  .usage("Usage: -n <name>")
  .option("n", {
    alias: "name",
    describe: "Your name",
    default: "",
    type: "string",
    demandOption: true
  })
  .argv;

const serverUrl = "ws://127.0.0.1:3000"

const io = socketIO(serverUrl, {
  query: { name: cliOptions.name }}
)

io.on("connect", () => {
  console.log(chalk.yellow.bold("Connected to the server!"))

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

  console.log(`${timestamp} - ${chalk.green(user)}: "${message}"`)
})
