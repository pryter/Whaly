import { Command } from "@itypes/command/Command"
import { EmbedBuilder, Message, SlashCommandBuilder, TextChannel } from "discord.js"
import { getUserVoiceChannel } from "@utils/cache"
import { splitArray } from "@utils/array"
import { warn } from "@utils/logger"
import { runningCat } from "@main/elements/icons/runningCat"
import prettyMilliseconds from "pretty-ms"
import { formatTrack, sendSelfDestroyReply } from "@utils/message"
import { queueEmbed } from "@main/elements/embeds/queue"
import { generateQueueMessage } from "@main/elements/message/queue"
import { commandResponseEmbed } from "@main/elements/embeds/commandResponse"
import { config } from "../../config"
import { checkNowPlaying, noPlayingSongError, queueGenerated } from "@main/elements/texts"

export const queueCommand = (): Command => {
  return {
    name: "queue",
    data: new SlashCommandBuilder().setName("queue").setDescription("Display current queue."),
    runtime: async (manager, interaction) => {
      const textChannel = interaction.channel
      const voiceChannel = await getUserVoiceChannel(interaction.client, interaction)
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

      if (player.queue.size === 0) {
        if (!player.queue.current) {
          sendSelfDestroyReply(
            interaction,
            { embeds: [commandResponseEmbed(noPlayingSongError)] },
            config.selfDestroyMessageLifeSpan
          )
          return
        }
        sendSelfDestroyReply(
          interaction,
          { embeds: [commandResponseEmbed(checkNowPlaying)] },
          config.selfDestroyMessageLifeSpan
        )
        return
      }
      const prevQueueMessage: Message | null = player.get("queueMessage")

      if (prevQueueMessage) {
        // clear prev session
        prevQueueMessage.delete().catch(warn)
        player.set("queueMessage", null)
        player.set("queuePage", 1)
        player.set("maxQueuePage", 1)
      }

      await generateQueueMessage(player, <TextChannel>textChannel, manager)
      sendSelfDestroyReply(
        interaction,
        { embeds: [commandResponseEmbed(queueGenerated)] },
        config.selfDestroyMessageLifeSpan
      )
    },
  }
}
