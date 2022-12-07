import type { Command } from "@itypes/command/Command"
import { commandResponseEmbed } from "@main/elements/embeds/commandResponse"
import { noPlayingSongError, skipped } from "@main/elements/texts"
import { getUserVoiceChannel } from "@utils/cache"
import { sendSelfDestroyReply } from "@utils/message"
import { SlashCommandBuilder } from "discord.js"

import { config } from "../../config"

export const skipCommand = (): Command => {
  return {
    name: "skip",
    data: new SlashCommandBuilder()
      .setName("skip")
      .setDescription("Skip current song"),
    runtime: async (manager, interaction) => {
      const textChannel = interaction.channel
      const voiceChannel = await getUserVoiceChannel(
        interaction.client,
        interaction
      )
      if (!voiceChannel || !textChannel || !interaction.guild) {
        return
      }

      const player = manager.players.get(interaction.guild.id)

      if (!player) {
        sendSelfDestroyReply(
          interaction,
          { embeds: [commandResponseEmbed(noPlayingSongError)] },
          config.selfDestroyMessageLifeSpan
        )
        return
      }

      player.queue.previous = player.queue.current
      player.stop()

      sendSelfDestroyReply(interaction, {
        embeds: [commandResponseEmbed(skipped)]
      })
    }
  }
}
