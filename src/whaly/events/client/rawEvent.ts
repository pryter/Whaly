import type { Client } from "discord.js"
import type { Manager } from "erela.js"

export const registerRawEvent = (client: Client, manager: Manager) => {
  client.on("raw", (d) => manager.updateVoiceState(d))
}
