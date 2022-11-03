import { Client } from "discord.js"
import { Manager } from "erela.js"

export const registerRawEvent = (client: Client, manager: Manager) => {
  client.on("raw", (d) => manager.updateVoiceState(d))
}
