import { err, warn } from "@utils/logger"
import type { Client } from "discord.js"

export const registerDebugEvent = (client: Client) => {
  client.on("warn", (e) => {
    warn(`Discord.js | ${e}`)
  })
  client.on("error", (e) => {
    err(`Discord.js | ${e.message}`)
  })
}
