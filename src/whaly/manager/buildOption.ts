import type { Client } from "discord.js"
import type { ManagerOptions } from "erela.js"

export const buildOption = (client: Client): ManagerOptions => {
  return {
    plugins: [],
    autoPlay: true,
    clientName: "whaly",
    nodes: [
      {
        identifier: "Lavalink Node",
        host: "0.0.0.0",
        port: 2333,
        password: process.env.LAVALINK_PASS,
        retryAmount: 200,
        retryDelay: 2000,
        version: "v4",
        useVersionPath: true,
        secure: false
      }
    ],
    send: (id, payload) => {
      const guild = client.guilds.cache.get(id)
      if (guild) {
        guild.shard.send(payload)
      }
    }
  }
}
