import { Client, TextChannel, VoiceChannel } from "discord.js"
import { Manager } from "erela.js"
import { buildRuntimeIndex } from "@main/commands"
import { getUserVoiceChannel } from "@utils/cache"
import { controllerStrip } from "@main/elements/buttons/controllerStrip"
import { ButtonInteractionData } from "@itypes/interaction/ButtonInteractionData"
import { handleControllerStripEvent } from "@main/events/client/interactions/controllerStrip"
import { handleReconnectEvent } from "@main/events/client/interactions/reconnect"

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

    if (interaction.isButton()) {
      const buttonId = interaction.customId
      const actionData = buttonId.split("_")
      const action = actionData[2]
      const guildId = actionData[1]
      const player = manager.get(guildId)
      const guild = client.guilds.cache.get(guildId)

      const voiceChannel = <VoiceChannel>getUserVoiceChannel(client, interaction)
      const textChannel = <TextChannel>interaction.channel

      if (!guild || !player) {
        return
      }

      const buttonInteractionData: ButtonInteractionData = {
        interaction: interaction,
        manager: manager,
        action: action,
        guild: guild,
        guildId: guildId,
        player: player,
        textChannel: textChannel,
        voiceChannel: voiceChannel,
      }

      // Controller strip button
      if (buttonId.startsWith("controllerStrip")) {
        handleControllerStripEvent(buttonInteractionData)
        return
      }

      if (buttonId.startsWith("reconnect")) {
        handleReconnectEvent(buttonInteractionData)
        return
      }
    }
  })
}
