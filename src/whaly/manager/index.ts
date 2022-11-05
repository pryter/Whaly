import { Manager } from "erela.js"

import { Client } from "discord.js"
import { buildOption } from "./buildOption"
import { err, info } from "@utils/logger"

export const createManager = (client: Client) => {
  const manager = new Manager(buildOption(client))

  // Register common node listeners

  manager.on("nodeConnect", (_) => {
    info("erela | Lavalink node connected")
  })

  manager.on("nodeError", (node, e) => {
    err(`erela | Lavalink error: ${e.message}`)
  })

  return manager
}
