import type { Command } from "@itypes/command/Command"
import { newControllerButtonStrip } from "@main/elements/buttons/controllerStrip"
import { commandResponseEmbed } from "@main/elements/embeds/commandResponse"
import { disconnectEmbed } from "@main/elements/embeds/discconect"
import { inactivityDisconnectReason } from "@main/elements/texts"
import { createPlayer } from "@main/player/createPlayer"
import { getUserVoiceChannel } from "@utils/cache"
import { sendSelfDestroyMessage } from "@utils/message"
import type {
  ActionRowBuilder,
  ButtonBuilder,
  TextChannel,
  VoiceChannel
} from "discord.js"
import { SlashCommandBuilder } from "discord.js"

import { config } from "../../config"

export const webCommand = (): Command => {
  return {
    name: "summon",
    data: new SlashCommandBuilder()
      .setName("summon")
      .setDescription("Just summon the bot to your voice channel."),
    runtime: async (manager, interaction, database) => {
      const textChannel = interaction.channel as TextChannel
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

      await interaction.reply({
        embeds: [
          commandResponseEmbed(
            "Summoned the bot! Play something before it leaves."
          )
        ],
        components: [
          newControllerButtonStrip(
            player.guild
          ) as ActionRowBuilder<ButtonBuilder>
        ],
        fetchReply: true
      })

      setTimeout(
        async () => {
          if (player.state === "DESTROYING") {
            return
          }

          if (!player.playing && player.state !== "DISCONNECTED") {
            await sendSelfDestroyMessage(
              textChannel,
              { embeds: [disconnectEmbed(inactivityDisconnectReason)] },
              config.selfDestroyMessageLifeSpan
            )
            player.destroy()
          }
        },
        config.reconnectEmbedLifeSpan > config.disconnectTime
          ? config.reconnectEmbedLifeSpan + config.disconnectTime
          : config.disconnectTime
      )
      return null
    }
  }
}
