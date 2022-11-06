import { Command } from "@itypes/command/Command"
import { SlashCommandBuilder } from "discord.js"
import { getUserVoiceChannel } from "@utils/cache"
import { commandResponseEmbed } from "@main/elements/embeds/commandResponse"
import { clearedNItems, nothingToBeCleared, skipped } from "@main/elements/texts"
import { config } from "../../config"
import { warn } from "@utils/logger"

export const skipCommand = (): Command => {
  return {
    name: "skip",
    data: new SlashCommandBuilder().setName("skip").setDescription("Skip current song"),
    runtime: async (manager, interaction) => {
      const textChannel = interaction.channel
      const voiceChannel = await getUserVoiceChannel(interaction.client, interaction)
      if (!voiceChannel || !textChannel || !interaction.guild) {
        return
      }

      const player = manager.players.get(interaction.guild.id)

      if (!player) return

      player.queue.previous = player.queue.current
      player.stop()

      const reply = await interaction.reply({
        embeds: [commandResponseEmbed(skipped)],
        fetchReply: true,
      })
      setTimeout(() => {
        reply.delete().catch((e) => {
          warn("whaly | Unable to delete command reply.")
        })
      }, config.selfDestroyMessageLifeSpan)
    },
  }
}
