import { Command } from "@itypes/command/Command"
import { EmbedBuilder, SlashCommandBuilder } from "discord.js"
import { getUserVoiceChannel } from "@utils/cache"
import { commandResponseEmbed } from "@main/elements/embeds/commandResponse"
import { Player } from "erela.js"
import { clearedNItems, nothingToBeCleared, skipPlayingTrackHint } from "@main/elements/texts"
import { warn } from "@utils/logger"
import { config } from "../../config"
import { sendSelfDestroyReply } from "@utils/message"

const ifSomethingPLaying = (player: Player, embed: EmbedBuilder) => {
  if (player.playing) {
    return embed.setFooter({ text: skipPlayingTrackHint })
  }
  return embed
}

export const clearCommand = (): Command => {
  return {
    name: "clear",
    data: new SlashCommandBuilder().setName("clear").setDescription("Sweep every tracks out of the queue!"),
    runtime: async (manager, interaction) => {
      const textChannel = interaction.channel
      const voiceChannel = await getUserVoiceChannel(interaction.client, interaction)
      if (!voiceChannel || !textChannel || !interaction.guild) {
        return
      }

      const player = manager.players.get(interaction.guild.id)

      if (!player) {
        sendSelfDestroyReply(interaction, {
          embeds: [commandResponseEmbed(nothingToBeCleared)],
        })
        return
      }
      if (!player.queue || player.queue.length === 0) {
        sendSelfDestroyReply(interaction, {
          embeds: [ifSomethingPLaying(player, commandResponseEmbed(nothingToBeCleared))],
        })
        return
      }

      const count = player.queue.size

      player.queue.clear()

      sendSelfDestroyReply(interaction, {
        embeds: [ifSomethingPLaying(player, commandResponseEmbed(clearedNItems(count)))],
      })
    },
  }
}
