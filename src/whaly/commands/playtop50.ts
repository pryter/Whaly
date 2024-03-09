import type { Command } from "@itypes/command/Command"
import { top50PlaylistAddedToQueueEmbed } from "@main/elements/embeds/top50PlaylistAddedToQueue"
import { refreshQueueMessage } from "@main/elements/message/queue"
import { createPlayer } from "@main/player/createPlayer"
import { getUserVoiceChannel } from "@utils/cache"
import { warn } from "@utils/logger"
import type { Message, TextChannel, VoiceChannel } from "discord.js"
import { EmbedBuilder, SlashCommandBuilder } from "discord.js"
import type { UnresolvedTrack } from "erela.js"
import { TrackUtils } from "erela.js"

export const playTop50 = (): Command => {
  return {
    name: "playtop50",
    data: new SlashCommandBuilder()
      .setName("playtop50")
      .setDescription("Add TOP-50 playlist to your queue."),
    runtime: async (manager, interaction, database) => {
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
        return playTop50().runtime(manager, interaction)
      }

      const reply = await interaction.reply({
        embeds: [
          new EmbedBuilder().setDescription(
            "<a:catbread:1037311587675017226> **Searching...**"
          )
        ],
        fetchReply: true
      })

      if (!database) {
        return null
      }

      const rawTracks = await database.collection("indexed").doc("top50").get()
      const rawTrackObj = rawTracks.get("ranking")
      const tracks: UnresolvedTrack[] = rawTrackObj.map((t: any) => {
        return TrackUtils.buildUnresolved(t.title, interaction.user)
      })

      player.queue.add(tracks)
      refreshQueueMessage(player, manager)

      if (
        !player.playing &&
        !player.paused &&
        player.queue.totalSize === tracks.length
      ) {
        player.play()
      }

      const embed = top50PlaylistAddedToQueueEmbed(
        "https://pryter.me/whaly/ranking",
        { name: "Whaly - Global TOP 50", duration: 0, selectedTrack: null }
      )

      await interaction.editReply({ embeds: [embed] }).catch(warn)
      if (reply) setTimeout(() => reply.delete().catch(warn), 20000)
      return null
    }
  }
}
