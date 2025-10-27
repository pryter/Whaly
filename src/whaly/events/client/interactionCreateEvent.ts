import type { Runtime } from "@itypes/command/Command"
import type { ButtonInteractionData } from "@itypes/interaction/ButtonInteractionData"
import { buildRuntimeIndex } from "@main/commands"
import { handleControllerStripEvent } from "@main/events/client/interactions/controllerStrip"
import { handleReconnectEvent } from "@main/events/client/interactions/reconnect"
import { getUserVoiceChannel } from "@utils/cache"
import { warn } from "@utils/logger"
import type {
  ChatInputCommandInteraction,
  Client,
  TextChannel,
  VoiceChannel
} from "discord.js"
import type { Manager } from "erela.js"
import type { Firestore } from "firebase-admin/firestore"

export const registerInteractionCreateEvent = (
  client: Client,
  manager: Manager,
  database: Firestore | null
) => {
  const runtimeIndex = buildRuntimeIndex()

  client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
      const { commandName } = interaction

      // Call runtime
      if (!(commandName in runtimeIndex)) {
        return
      }

      const runtime = <Runtime>runtimeIndex[commandName]
      runtime(manager, interaction as ChatInputCommandInteraction, database)
    }

    if (interaction.isButton()) {
      const buttonId = interaction.customId
      const actionData = buttonId.split("_")
      const action = actionData[2]
      const guildId = actionData[1]

      if (!guildId || !action) {
        warn("whaly | button interaction fired without guildId or action")
        return
      }

      const player = manager.get(guildId)
      const guild = client.guilds.cache.get(guildId)

      const voiceChannel = <VoiceChannel>(
        getUserVoiceChannel(client, interaction)
      )
      const textChannel = <TextChannel>interaction.channel

      if (!guild || !player) {
        return
      }

      const buttonInteractionData: ButtonInteractionData = {
        interaction,
        manager,
        action,
        guild,
        guildId,
        player,
        textChannel,
        voiceChannel
      }

      // Controller strip button
      if (buttonId.startsWith("controllerStrip")) {
        handleControllerStripEvent(buttonInteractionData)
        return
      }

      if (buttonId.startsWith("reconnect")) {
        handleReconnectEvent(buttonInteractionData)
      }
    }
  })
}
