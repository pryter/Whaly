import type { Command } from "@itypes/command/Command"
import { commandResponseEmbed } from "@main/elements/embeds/commandResponse"
import { noPlayingSongError } from "@main/elements/texts"
import { getUserVoiceChannel } from "@utils/cache"
import { sendSelfDestroyReply } from "@utils/message"
import { SlashCommandBuilder } from "discord.js"

import { config } from "../../config"

export const webCommand = (): Command => {
  return {
    name: "web",
    data: new SlashCommandBuilder()
      .setName("web")
      .setDescription("Get web url"),
    runtime: async (manager, interaction, database) => {
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
      const guildId = voiceChannel.guild.id

      sendSelfDestroyReply(
        interaction,
        {
          embeds: [
            commandResponseEmbed(`https://whaly.pryter.me/remote/${guildId}`)
          ]
        },
        config.selfDestroyMessageLifeSpan
      )
      // const d = await database
      //   ?.collection("remote")
      //   .where("sessionId", "==", sessionID)
      //   .where("guildId", "==", guildId)
      //   .get()
      //
      // if (d && d.size > 0) {
      //   const doc = d.docs[0]
      //   if (doc) {
      //     textChannel.send({
      //       embeds: [
      //         commandResponseEmbed(`https://whaly.pryter.me/remote/${guildId}`)
      //       ]
      //     })
      //   }
      // } else {
      //   const ref = await database?.collection("remote")?.add({
      //     sessionId: sessionID,
      //     guid: guildId
      //   })
      //   if (ref) {
      //     textChannel.send({
      //       embeds: [commandResponseEmbed(`http://localhost:3000/id/${ref.id}`)]
      //     })
      //   }
      // }
      return null
    }
  }
}
