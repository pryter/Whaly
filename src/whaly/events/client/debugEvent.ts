import { Client } from "discord.js"
import { err, warn } from "@utils/logger"

export const registerDebugEvent = (client: Client) => {
  client.on("warn", (e) => {
    warn(`Discord.js | ${e}`)
  })
  client.on("error", (e) => {
    err(`Discord.js | ${e.message}`)
  })
}
