import { Client } from "discord.js"
import { Manager } from "erela.js"
import { buildRuntimeIndex } from "@main/commands"

export const registerInteractionCreateEvent = (client: Client, manager: Manager) => {
  const runtimeIndex = buildRuntimeIndex()

  client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
      const commandName = interaction.commandName

      // Call runtime
      if (commandName in runtimeIndex) {
        runtimeIndex[commandName](manager, interaction)
      }
    }
  })
}
