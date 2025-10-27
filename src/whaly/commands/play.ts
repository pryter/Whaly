import type { Command } from "@itypes/command/Command"
import { addedToQueueEmbed } from "@main/elements/embeds/addedToQueue"
import { commandErrorEmbed } from "@main/elements/embeds/commandError"
import { playlistAddedToQueueEmbed } from "@main/elements/embeds/playlistAddedToQueue"
import { refreshQueueMessage } from "@main/elements/message/queue"
import { searchingError } from "@main/elements/texts"
import { createPlayer } from "@main/player/createPlayer"
import { getUserVoiceChannel } from "@utils/cache"
import { err, warn } from "@utils/logger"
import type { Message, TextChannel, VoiceChannel } from "discord.js"
import { EmbedBuilder, SlashCommandBuilder } from "discord.js"
import type { Track } from "erela.js"

export const playCommand = (): Command => {
  return {
    name: "play",
    data: new SlashCommandBuilder()
      .setName("play")
      .setDescription(
        "Find requested song\n__Supports:__\nYoutube, Spotify, Deezer, Apple Music"
      )
      .addStringOption((option) =>
        option
          .setName("query")
          .setDescription("What am I looking for?")
          .setRequired(true)
      ),
    runtime: async (manager, interaction) => {
      const textChannel = interaction.channel
      const voiceChannel = await getUserVoiceChannel(
        interaction.client,
        interaction
      )

      if (!voiceChannel || !textChannel) {
        return null
      }
      if (textChannel.isDMBased()) {
        return null
      }
      const player = createPlayer(
        manager,
        <TextChannel>textChannel,
        <VoiceChannel>voiceChannel
      )

      if (player.state !== "CONNECTED") {
        player.connect()
      }

      // If got forced disconnected
      if (player.get("reconnectMessage")) {
        player.destroy()
        const reconnectMess: Message | null = player.get("reconnectMessage")
        reconnectMess?.delete().catch((_) => {
          warn(`whaly | can't delete reconnect message`)
        })
        player.set("reconnectMessage", null)
        return playCommand().runtime(manager, interaction)
      }

      const reply = await interaction.reply({
        embeds: [
          new EmbedBuilder().setDescription(
            "<a:catbread:1037311587675017226> **Searching...**"
          )
        ],
        fetchReply: true
      })

      const query = <string>interaction.options.get("query", true).value
      const response = await player
        .search(query, interaction.user)
        .catch((e) => {
          err(`Command Play | ${e}`)
        })

      if (!response) {
        if (!player.queue.current) {
          player.destroy()
        }
        await interaction
          .editReply({
            embeds: [commandErrorEmbed(searchingError)]
          })
          .catch(warn)
        return reply.delete()
      }

      player.set("retries", 0)
      player.set("retriedTrack", "")

      switch (response.loadType) {
        case "empty":
          if (!player.queue.current) {
            player.destroy()
          }
          await interaction
            .editReply({
              embeds: [
                new EmbedBuilder()
                  .setColor("Red")
                  .setDescription("No results were found")
              ]
            })
            .catch(warn)
          break
        case "search":
        case "track":
          {
            const track = <Track>response.tracks[0]

            player.queue.add(track)
            refreshQueueMessage(player, manager)

            if (!player.playing && !player.paused && !player.queue.size) {
              player.play()
            }

            const addToQueueEmbed = addedToQueueEmbed(track)

            if (player.queue.totalSize > 1) {
              addToQueueEmbed.addFields({
                name: "Position in the queue",
                value: `${player.queue.size}`,
                inline: true
              })
            } else {
              player.queue.previous = player.queue.current
            }

            await interaction
              .editReply({ embeds: [addToQueueEmbed] })
              .catch(warn)
          }
          break
        case "playlist":
          {
            player.queue.add(response.tracks)
            refreshQueueMessage(player, manager)

            if (
              !player.playing &&
              !player.paused &&
              player.queue.totalSize === response.tracks.length
            ) {
              player.play()
            }

            const playlistEmbed = playlistAddedToQueueEmbed(
              query,
              response.tracks,
              response.playlist
            )

            await interaction.editReply({ embeds: [playlistEmbed] }).catch(warn)
          }
          break
        default:
          err("Invalid status")
      }

      if (reply) setTimeout(() => reply.delete().catch(warn), 20000)
      return null
    }
  }
}
