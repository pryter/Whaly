import type { Command } from "@itypes/command/Command"
import { commandResponseEmbed } from "@main/elements/embeds/commandResponse"
import {
  clearedNItems,
  nothingToBeCleared,
  skipPlayingTrackHint
} from "@main/elements/texts"
import { getUserVoiceChannel } from "@utils/cache"
import { sendSelfDestroyReply } from "@utils/message"
import type { EmbedBuilder } from "discord.js"
import { SlashCommandBuilder } from "discord.js"
import type { Player } from "erela.js"

const ifSomethingPLaying = (player: Player, embed: EmbedBuilder) => {
  if (player.playing) {
    return embed.setFooter({ text: skipPlayingTrackHint })
  }
  return embed
}

export const clearCommand = (): Command => {
  return {
    name: "clear",
    data: new SlashCommandBuilder()
      .setName("clear")
      .setDescription("Sweep every tracks out of the queue!"),
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
        sendSelfDestroyReply(interaction, {
          embeds: [commandResponseEmbed(nothingToBeCleared)]
        })
        return
      }
      if (!player.queue || player.queue.length === 0) {
        sendSelfDestroyReply(interaction, {
          embeds: [
            ifSomethingPLaying(player, commandResponseEmbed(nothingToBeCleared))
          ]
        })
        return
      }

      const count = player.queue.size

      player.queue.clear()

      sendSelfDestroyReply(interaction, {
        embeds: [
          ifSomethingPLaying(player, commandResponseEmbed(clearedNItems(count)))
        ]
      })
    }
  }
}
