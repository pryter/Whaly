import { EmbedBuilder, SlashCommandBuilder, TextChannel, VoiceChannel } from "discord.js"
import { Command } from "@itypes/command/Command"
import { createPlayer } from "@main/player/createPlayer"
import { getUserVoiceChannel } from "@utils/cache"
import { err, warn } from "@utils/logger"
import { SearchResult } from "erela.js"
import prettyMilliseconds from "pretty-ms"
import { runningCat } from "@main/elements/icons/runningCat"
import { addedToQueueEmbed } from "@main/elements/embeds/addedToQueue"
import { commandErrorEmbed } from "@main/elements/embeds/commandError"
import { searchingError } from "@main/elements/texts"
import { playlistAddedToQueueEmbed } from "@main/elements/embeds/playlistAddedToQueue"

export const playCommand = (): Command => {
  return {
    name: "play",
    data: new SlashCommandBuilder()
      .setName("play")
      .setDescription("Find requested song\n__Supports:__\nYoutube, Spotify, Deezer, Apple Music")
      .addStringOption((option) => option.setName("query").setDescription("What am I looking for?").setRequired(true)),
    runtime: async (manager, interaction) => {
      const textChannel = interaction.channel
      const voiceChannel = await getUserVoiceChannel(interaction.client, interaction)

      if (!voiceChannel || !textChannel) {
        return
      }
      if (textChannel.isDMBased()) {
        return
      }
      const player = createPlayer(manager, <TextChannel>textChannel, <VoiceChannel>voiceChannel)

      if (player.state !== "CONNECTED") {
        player.connect()
      }

      const reply = await interaction.reply({
        embeds: [new EmbedBuilder().setDescription("<a:catbread:1037311587675017226> **Searching...**")],
        fetchReply: true,
      })

      let query = <string>interaction.options.get("query", true).value
      let response = await player.search(query, interaction.user).catch((e) => {
        err(`Command Play | ${e}`)
      })

      if (!response) {
        if (!player.queue.current) {
          player.destroy()
        }
        await interaction
          .editReply({
            embeds: [commandErrorEmbed(searchingError)],
          })
          .catch(warn)
        return reply.delete()
      }

      switch (response.loadType) {
        case "NO_MATCHES":
          if (!player.queue.current) {
            player.destroy()
          }
          await interaction
            .editReply({
              embeds: [new EmbedBuilder().setColor("Red").setDescription("No results were found")],
            })
            .catch(warn)
          break
        case "SEARCH_RESULT":
        case "TRACK_LOADED":
          const track = response.tracks[0]
          player.queue.add(track)

          if (!player.playing && !player.paused && !player.queue.size) {
            player.play()
          }

          let addToQueueEmbed = addedToQueueEmbed(track)

          if (player.queue.totalSize > 1) {
            addToQueueEmbed.addFields({
              name: "Position in the queue",
              value: `${player.queue.size}`,
              inline: true,
            })
          } else {
            player.queue.previous = player.queue.current
          }

          await interaction.editReply({ embeds: [addToQueueEmbed] }).catch(warn)
          break
        case "PLAYLIST_LOADED":
          player.queue.add(response.tracks)

          if (!player.playing && !player.paused && player.queue.totalSize === response.tracks.length) {
            player.play()
          }

          let playlistEmbed = playlistAddedToQueueEmbed(query, response.tracks, response.playlist)

          await interaction.editReply({ embeds: [playlistEmbed] }).catch(warn)
      }

      reply && setTimeout(() => reply.delete().catch(warn), 20000)
    },
  }
}
